const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
require('../../api-client/test/load.cjs');
const { createAdsClient } = require('../../api-client/src/index.ts');
const { createAdsOperations } = require('../../api-client/src/ads-operations.ts');
function modules(fetcher, app = "ads") {
  const root = path.resolve(__dirname, `../../../web/${app}/src/lib`);
  const cache = new Map();
  function load(name) {
    if (name === "session") return { sessionFetch: fetcher };
    if (name === 'ads-api-client') {
      const send = async (url, init = {}) => fetcher(new URL(url).pathname + new URL(url).search, {
        ...init, body: init.body instanceof Blob ? await init.body.text() : init.body,
      });
      return { adsApi: () => createAdsOperations(createAdsClient({ origin: 'https://ads.example', sessionFetch: send,
        publicFetch: request => send(request.url, { method: request.method, headers: request.headers }),
      })) };
    }
    if (cache.has(name)) return cache.get(name);
    const exports = {};
    cache.set(name, exports);
    const source = fs.readFileSync(path.join(root, `${name}.ts`), "utf8");
    const code = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext(code, {
      exports,
      require: (relative) => load(relative.replace("./", "")),
      URL,
      URLSearchParams,
      crypto: require("node:crypto").webcrypto,
    });
    return exports;
  }
  return load;
}
const success = (data, status = 200) =>
  new Response(JSON.stringify({ status: "success", data }), {
    status, headers: { "Content-Type": "application/json" },
  });

test("location authoring is available only with an explicit server capability", async () => {
  for (const value of [undefined, false, "true", true]) {
    const load = modules(async () => success({ geoTargetingEnabled: value, supportedAdTypes: ['text', 'image'] }));
    if (typeof value !== 'boolean') {
      await assert.rejects(load('campaigns-api').loadCreationCapabilities());
      continue;
    }
    assert.equal(
      (await load("campaigns-api").loadCreationCapabilities())
        .geoTargetingEnabled,
      value === true,
    );
  }
});

test("Ads read helpers preserve real empty results without sample substitutions", async () => {
  const load = modules(async (url) =>
    success(url.includes("settlements") ? { batches: [] } : []),
  );
  for (const value of [
    await load("conversions-api").fetchConversions(),
    await load("conversions-api").fetchApiKeys(),
    await load("disputes-api").fetchDisputes(),
    await load("billing-api").fetchSettlementBatches(),
  ]) {
    assert.equal(value.length, 0);
  }
});

test("failed or malformed Ads reads reject instead of inventing records or a zero balance", async () => {
  for (const fetcher of [
    async () => new Response("", { status: 403 }),
    async () => {
      throw new Error("offline");
    },
    async () => success({ wrong: true }),
    async () => new Response("invalid json"),
  ]) {
    const load = modules(fetcher);
    await assert.rejects(load("conversions-api").fetchConversions());
    await assert.rejects(load("disputes-api").fetchDisputes());
    await assert.rejects(load("billing-api").fetchBillingOverview());
  }
});

test("conversion amounts use micros and preserve an explicit zero USD value", async () => {
  const api = modules(async () =>
    success([
      {
        id: "c",
        valueMicros: 9999999,
        valueUsdMicros: 0,
        chargedMicros: 1250000,
        status: "unattributed",
      },
    ]),
  )("conversions-api");
  const [row] = await api.fetchConversions();
  assert.equal(row.valueUsd, 0);
  assert.equal(row.chargedUsd, 1.25);
  assert.equal(row.status, "unattributed");
});

test("one-time API key response uses the actual server secret and never fabricates one", async () => {
  const key = await modules(async () =>
    success({
      id: "key",
      key: "cf_adv_server_secret",
      prefix: "cf_adv_server",
    }),
  )("conversions-api").createApiKey("Production");
  assert.equal(key.rawSecretKey, "cf_adv_server_secret");
  await assert.rejects(
    modules(async () => success({ id: "key" }))("conversions-api").createApiKey(
      "Production",
    ),
  );
});

test("Ads mutations propagate rejection once without claiming success or replaying", async () => {
  let calls = 0;
  const load = modules(async () => {
    calls++;
    return new Response("", { status: 500 });
  });
  const api = load("conversions-api");
  for (const operation of [
    () => api.createApiKey("key"),
    () => api.revokeApiKey("id"),
    () => api.reverseConversion("id", "reason"),
    () => load("disputes-api").createDispute({ role: "advertiser" }),
    () => load("billing-api").triggerManualSettlement(),
  ]) {
    const previous = calls;
    await assert.rejects(operation());
    assert.equal(calls, previous + 1);
  }
});

test("wallet zero is retained, amounts derive from cents and escrow refunds come from server", async () => {
  const api = modules(async () =>
    success({
      wallet: {
        availableUsdCents: 0,
        lockedUsdCents: 100,
        totalUsdCents: 100,
        exchangeRate: 1600,
        estimatedNgn: 0,
      },
      campaignEscrows: {
        items: [
          {
            id: "escrow",
            campaignId: "campaign",
            allocatedUsd: 5,
            consumedUsd: 1,
            refundedUsd: 2,
            remainingUsd: 2,
          },
        ],
      },
    }),
  )("billing-api");
  const result = await api.fetchBillingOverview();
  assert.equal(result.wallet.availableUsd, 0);
  assert.equal(result.wallet.totalUsd, 1);
  assert.equal(result.escrows[0].refundedUsd, 2);
  assert.equal(result.escrows[0].id, "escrow");
});

test("preview paths accept only canonical same-origin media for owner and staff reads", () => {
  const { previewPath } = modules()("media-preview");
  assert.equal(
    previewPath(
      "/api/v1/uploads/media/file.png",
      "https://ads.crimfig.com",
      "owner",
    ),
    "/api/v1/uploads/private-media/file.png",
  );
  assert.equal(
    previewPath(
      "https://ads.crimfig.com/api/v1/uploads/media/file.png",
      "https://ads.crimfig.com",
      "review",
    ),
    "/api/v1/uploads/review-media/file.png",
  );
  for (const value of [
    "https://evil.example/api/v1/uploads/media/file",
    "//evil.example/api/v1/uploads/media/file",
    "https://user:secret@ads.crimfig.com/api/v1/uploads/media/file",
    "/api/v1/uploads/media/file?review=true",
    "/api/v1/uploads/media/a%2Fb",
    "/api/v1/uploads/media/%2e%2e",
    "/api/v1/uploads/media/a%5Cb",
    "data:image/png;base64,123",
  ]) {
    assert.throws(() =>
      previewPath(value, "https://ads.crimfig.com", "review"),
    );
  }
});

test("Ads account campaigns and public catalog use different endpoints without default bids", async () => {
  const urls = [];
  const api = modules(async (url) => {
    urls.push(url);
    return success([
      {
        id: "campaign",
        title: "Saved",
        format: "card",
        budgetUsdCents: 500,
        remainingBudgetUsdCents: 500,
        costPerClickUsdCents: 0,
        status: "paused",
        moderationStatus: 'draft',
      },
    ]);
  })("campaigns-api");
  const [row] = await api.loadCampaigns(true);
  await api.loadCampaigns(false);
  assert.deepEqual(urls, ["/api/v1/campaigns", "/api/v1/campaigns/catalog"]);
  assert.equal(row.cpcUsd, 0);
  assert.equal(row.spentUsd, 0);
  assert.equal(row.metricsLoaded, false);
});

test("campaign creation attaches actual creatives and submits review once in order", async () => {
  const calls = [];
  const api = modules(async (url, init) => {
    calls.push([url, init]);
    return success({
      id: "saved-id",
      title: 'Saved', format: 'card', campaignId: 'saved-id', name: 'Stack', destinationUrl: 'https://example.test',
      status: 'draft', moderationStatus: 'draft', budgetUsdCents: 500, remainingBudgetUsdCents: 500,
      contentRevision: init.method === 'PATCH' ? 2 : 1,
      ...(url.endsWith("campaigns")
        ? { defaultStackId: "11111111-1111-4111-8111-111111111111" }
        : url.endsWith("submit-review")
          ? { moderationStatus: "pending_primary_review" }
          : {}),
    }, init.method === 'POST' ? 201 : 200);
  })("campaigns-api");
  assert.equal(
    await api.createCampaignWorkflow(
      {
        title: "Saved",
        budgetUsd: 5,
        format: "card",
        pricingModel: "cpc",
        costPerClickCents: 10,
        geoMode: "global",
      },
      [
        {
          name: "Stack",
          geoMode: "inherit",
          locations: [],
          targetDevices: [],
          targetHours: [],
          ads: [
            {
              adType: "text",
              headline: "Creative",
              destinationUrl: "https://example.test",
              adFormat: "card",
            },
          ],
        },
      ],
    ),
    "saved-id",
  );
  assert.deepEqual(
    calls.map((call) => [call[0], call[1].method]),
    [
      ["/api/v1/campaigns", "POST"],
      ["/api/v1/campaigns/saved-id", "PATCH"],
      ["/api/v1/campaigns/saved-id/submit-review", "POST"],
    ],
  );
  const patchBody = JSON.parse(calls[1][1].body);
  assert.equal(patchBody.expectedRevision, 1);
  assert.equal(patchBody.stacks[0].id, "11111111-1111-4111-8111-111111111111");
  assert.equal(patchBody.stacks[0].ads[0].headline, "Creative");
  const submitBody = JSON.parse(calls[2][1].body);
  assert.equal(submitBody.expectedRevision, 2);
});

test("partial campaign writes surface the saved ID without continuing or replaying", async () => {
  const calls = [];
  const api = modules(async (url) => {
    calls.push(url);
    if (calls.length === 1)
      return success({ id: "saved-id", title: 'Saved', format: 'card', status: 'draft', moderationStatus: 'draft', budgetUsdCents: 500, remainingBudgetUsdCents: 500, defaultStackId: "11111111-1111-4111-8111-111111111111", contentRevision: 1 }, 201);
    throw new Error("lost response");
  })("campaigns-api");
  await assert.rejects(
    api.createCampaignWorkflow(
      {
        title: "Saved",
        budgetUsd: 5,
        format: "card",
        pricingModel: "cpc",
        costPerClickCents: 10,
        geoMode: "global",
      },
      [
        {
          name: "Stack",
          geoMode: "inherit",
          locations: [],
          targetDevices: [],
          targetHours: [],
          ads: [
            {
              adType: "text",
              headline: "Creative",
              destinationUrl: "https://example.test",
              adFormat: "card",
            },
            {
              adType: "text",
              headline: "Another",
              destinationUrl: "https://example.test",
              adFormat: "card",
            },
          ],
        },
      ],
    ),
    (err) => err.campaignId === "saved-id" && err.message.includes("Check"),
  );
  assert.equal(calls.length, 2);
});

test("saveCampaignEditor persists server draft without submitting and hydrates/scopes recovery per owner", async () => {
  const calls = [];
  const api = modules(async (url, init) => {
    calls.push([url, init?.method || "GET"]);
    if (url.includes("creation-request")) return success(null);
    return success({
      id: "draft-id",
      title: "Draft Campaign",
      format: "card",
      status: "draft",
      moderationStatus: "draft",
      budgetUsdCents: 1000,
      remainingBudgetUsdCents: 1000,
      defaultStackId: "11111111-1111-4111-8111-111111111111",
      contentRevision: init?.method === "PATCH" ? 2 : 1,
    }, init?.method === "POST" ? 201 : 200);
  })("campaigns-api");
  const saved = await api.saveCampaignEditor(
    {
      title: "Draft Campaign",
      budgetUsd: 10,
      format: "card",
      pricingModel: "cpm",
      costPerImpressionCents: 50,
      geoMode: "global",
      requestId: "22222222-2222-4222-8222-222222222222",
    },
    [{ name: "Stack 1", geoMode: "inherit", locations: [], targetDevices: [], targetHours: [], ads: [] }],
  );
  assert.equal(saved.id, "draft-id");
  assert.equal(saved.contentRevision, 2);
  assert.deepEqual(calls, [
    ["/api/v1/campaigns/creation-request/22222222-2222-4222-8222-222222222222", "GET"],
    ["/api/v1/campaigns", "POST"],
    ["/api/v1/campaigns/draft-id", "PATCH"],
  ]);

  const editor = modules()("campaign-editor");
  assert.equal(editor.editorRecoveryScope("owner-a", "camp-1", 3), "owner-a:camp-1:3");
  assert.notEqual(editor.editorRecoveryScope("owner-a", "camp-1", 3), editor.editorRecoveryScope("owner-b", "camp-1", 3));
  const hydrated = editor.hydrateCampaign({
    id: "draft-id",
    title: "Draft Campaign",
    description: "Desc",
    category: "Tech",
    geoMode: "targeted",
    geoLocations: [{ id: "NG" }],
    targetDevices: ["mobile"],
    frequencyCapPerDay: 4,
    pricingModel: "cpc",
    budgetUsdCents: 1500,
    dailyBudgetUsdCents: 500,
    costPerImpressionUsdCents: 60,
    costPerClickUsdCents: 25,
    adStacks: [{ id: "s1", name: "Primary Stack", settings: { geoMode: "inherit", locations: [], targetDevices: ["mobile"] } }],
    creatives: [{ id: "a1", adStackId: "s1", adType: "image", headline: "Headline", bodyText: "Body", ctaText: "Visit", destinationUrl: "https://example.com", mediaAssetId: "m1", imageUrl: "/api/v1/uploads/media/m1.png", adFormat: "banner", imageSpecs: { width: 728, height: 90, bytes: 12000, mimeType: "image/png" } }],
  });
  assert.equal(hydrated.budgetUsd, 15);
  assert.equal(hydrated.dailyBudgetUsd, 5);
  assert.equal(hydrated.stacks[0].ads[0].imageInfo.width, 728);
  assert.equal(hydrated.stacks[0].ads[0].adFormat, "banner");
});

test("unsupported pricing never creates a campaign and failed status changes never succeed", async () => {
  let calls = 0;
  const api = modules(async () => {
    calls++;
    return new Response("", { status: 403 });
  })("campaigns-api");
  await assert.rejects(
    api.createCampaignWorkflow(
      { title: "Saved", budgetUsd: 5, format: "card", pricingModel: "cpa" },
      [{}],
    ),
  );
  assert.equal(calls, 0);
  await assert.rejects(api.setCampaignStatus("campaign", "active"));
  assert.equal(calls, 1);
});

test("website registration persists server token and ID and never synthesizes verification", async () => {
  let payload;
  const api = modules(async (url, init) => {
    payload = JSON.parse(init.body);
    return success({
      id: "server-site",
      domain: "example.test",
      verificationToken: "server-token",
      verificationStatus: "pending",
    });
  })("campaigns-api");
  const site = await api.registerWebsite("example.test", "dns_txt");
  assert.equal(site.id, "server-site");
  assert.equal(site.verificationToken, "server-token");
  assert.equal(site.isVerified, false);
  assert.equal(payload.url, "https://example.test");
  assert.equal(payload.domain, "example.test");
  for (const value of [
    "http://example.test",
    "https://user:password@example.test",
    "https://example.test/path",
  ])
    await assert.rejects(api.registerWebsite(value, "dns_txt"));
});

test("negative domain verification remains negative and preserves the server error", async () => {
  const api = modules(async () =>
    success({
      isVerified: false,
      errorMessage: "DNS token missing",
      website: {
        id: "site",
        domain: "example.test",
        verificationToken: "server-token",
        verificationStatus: "failed",
      },
    }),
  )("campaigns-api");
  const result = await api.verifyWebsite("site");
  assert.equal(result.site.isVerified, false);
  assert.equal(result.error, "DNS token missing");
});

test("dashboard uses real API periods and preserves all zero metrics and empty series", async () => {
  const summary = {
    campaignCounts: { total: 0 },
    creativeAlertCounts: { rejected: 0 },
    financials: { totalBudgetUsd: 0, totalSpentUsd: 0, remainingBudgetUsd: 0 },
    performance: {
      impressions: 0,
      clicks: 0,
      hovers: 0,
      touches: 0,
      ctr: 0,
      avgCpmUsd: 0,
      avgCpcUsd: 0,
    },
  };
  const api = modules(async (url) =>
    success(url.includes("/summary") ? summary : []),
  )("analytics-api");
  const data = await api.dashboardData("7d");
  assert.equal(data.summary.financials.totalSpentUsd, 0);
  assert.equal(data.timeseries.length, 0);
  await assert.rejects(api.dashboardData("custom"));
  await assert.rejects(
    modules(async () => success({}))("analytics-api").dashboardData("30d"),
  );
});

test("Billing bank resolution requires a real holder and matching account response", async () => {
  const api = modules(
    async () =>
      success({ account_name: "TEST HOLDER", account_number: "1234567890" }),
    "billing",
  )("billing-api");
  assert.equal(
    (await api.resolveBank("1234567890", "058")).accountName,
    "TEST HOLDER",
  );
  await assert.rejects(api.resolveBank("123", "058"));
  for (const data of [
    {},
    { account_name: "" },
    { account_name: "OTHER", account_number: "0000000000" },
  ]) {
    await assert.rejects(
      modules(
        async () => success(data),
        "billing",
      )("billing-api").resolveBank("1234567890", "058"),
    );
  }
});

test("Billing never fabricates a verified holder after a service failure", async () => {
  let calls = 0;
  const api = modules(async () => {
    calls++;
    return new Response("", { status: 503 });
  }, "billing")("billing-api");
  await assert.rejects(api.resolveBank("1234567890", "058"));
  assert.equal(calls, 1);
});

test("saving a bank requires confirmed persisted identity and verification", async () => {
  const input = {
    accountNumber: "1234567890",
    bankCode: "058",
    bankName: "TEST BANK",
  };
  const saved = await modules(
    async () => success({ id: "server-bank", ...input, isVerified: true }),
    "billing",
  )("billing-api").saveBank(input);
  assert.equal(saved.id, "server-bank");
  for (const data of [
    { ...input },
    { id: "wrong", ...input, isVerified: false },
    { id: "wrong", ...input, accountNumber: "0000000000", isVerified: true },
  ])
    await assert.rejects(
      modules(
        async () => success(data),
        "billing",
      )("billing-api").saveBank(input),
    );
});

test("checkout redirects accept only the configured provider host over HTTPS without embedded credentials", () => {
  const { checkoutUrl } = modules(undefined, "billing")("billing-api");
  assert.equal(
    checkoutUrl("https://checkout.paystack.com/test-reference"),
    "https://checkout.paystack.com/test-reference",
  );
  for (const value of [
    "http://checkout.paystack.com/test",
    "https://evil.example/test",
    "https://checkout.paystack.com.evil.example/test",
    "https://user:password@checkout.paystack.com/test",
    "javascript:alert(1)",
    undefined,
  ])
    assert.throws(() => checkoutUrl(value));
});

test("conversion amounts distinguish zero, missing and unproven non-USD values", async () => {
  const rows = [
    { id: "zero", currency: "USD", valueUsdMicros: 0, chargedMicros: 0 },
    {
      id: "foreign",
      currency: "NGN",
      valueUsdMicros: 5000000,
      valueMicros: 5000000,
      chargedMicros: null,
    },
    { id: "missing" },
  ];
  const result = await modules(async () => success(rows))(
    "conversions-api",
  ).fetchConversions();
  assert.equal(result[0].valueUsd, 0);
  assert.equal(result[0].chargedUsd, 0);
  assert.equal(result[1].valueUsd, null);
  assert.equal(result[1].chargedUsd, null);
  assert.equal(result[2].valueUsd, null);
  for (const value of ["5", -1, 0.5, Number.MAX_SAFE_INTEGER + 1]) {
    await assert.rejects(
      modules(async () =>
        success([{ id: "bad", currency: "USD", valueUsdMicros: value }]),
      )("conversions-api").fetchConversions(),
    );
  }
});
