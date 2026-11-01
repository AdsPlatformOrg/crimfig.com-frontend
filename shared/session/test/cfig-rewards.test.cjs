const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  ts = require("typescript");
const root = path.resolve(__dirname, "../../../");
function compile(file, imports = {}, globals = {}) {
  const exports = {};
  const result = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
      },
      reportDiagnostics: true,
    },
  );
  assert.equal(
    (result.diagnostics || []).filter(
      (d) => d.category === ts.DiagnosticCategory.Error,
    ).length,
    0,
  );
  vm.runInNewContext(result.outputText, {
    exports,
    require: (n) => imports[n] || {},
    ...globals,
  });
  return exports;
}
const format = compile("web/ads/src/lib/cfig-format.ts");
const navigation = compile("web/ads/src/lib/workspace-navigation.ts", {
  "lucide-react": new Proxy({}, { get: (_, key) => key }),
});
test("reward navigation requires financial grants and remains workspace-specific", () => {
  const links = (groups) =>
    groups
      .flatMap((g) => g.items)
      .flatMap((i) => [i.href, ...(i.children || []).map((c) => c.href)]);
  assert.ok(
    !links(navigation.workspaceNavigation("admin", ["ads_reviewer"])).includes(
      "/admin/rewards/cfig",
    ),
  );
  assert.ok(
    links(navigation.workspaceNavigation("admin", ["ads_finance"])).includes(
      "/admin/rewards/cfig",
    ),
  );
  assert.ok(
    links(navigation.workspaceNavigation("promoter")).includes(
      "/promoter/rewards",
    ),
  );
  assert.ok(
    !links(navigation.workspaceNavigation("advertiser")).includes(
      "/promoter/rewards",
    ),
  );
});
const text = (n) =>
  n == null
    ? ""
    : typeof n === "string" || typeof n === "number"
      ? String(n)
      : Array.isArray(n)
        ? n.map(text).join(" ")
        : (n.children || []).map(text).join(" ");
function mount(mode, request) {
  let cursor = 0,
    tree;
  const states = [],
    effects = [];
  const react = {
    createElement: (type, props, ...children) => ({
      type,
      props: props || {},
      children,
    }),
    useState(initial) {
      const i = cursor++;
      if (!(i in states)) states[i] = initial;
      return [
        states[i],
        (v) => (states[i] = typeof v === "function" ? v(states[i]) : v),
      ];
    },
    useRef(initial) {
      const i = cursor++;
      return states[i] || (states[i] = { current: initial });
    },
    useCallback(fn, deps) {
      const i = cursor++;
      if (!states[i] || deps.some((d, j) => d !== states[i].deps[j]))
        states[i] = { deps, fn };
      return states[i].fn;
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!states[i] || deps.some((d, j) => d !== states[i].deps[j])) {
        states[i]?.cleanup?.();
        states[i] = { deps };
        effects.push(() => (states[i].cleanup = fn()));
      }
    },
  };
  const generic = new Proxy({}, { get: (_, k) => k });
  const { CfigRewardsView } = compile(
    "web/ads/src/components/console/CfigRewardsView.tsx",
    {
      react: react,
      "next/link": { __esModule: true, default: "Link" },
      "@/lib/session": { sessionFetch: request },
      "@/lib/cfig-format": format,
      "../ui": generic,
    },
    { React: react, crypto: { randomUUID: () => "test-request" } },
  );
  const api = {
    render() {
      cursor = 0;
      tree = CfigRewardsView({ mode });
      while (effects.length) effects.shift()();
      return tree;
    },
    async settle() {
      await new Promise(setImmediate);
      return this.render();
    },
    text() {
      return text(tree);
    },
    nodes() {
      const found = [];
      function walk(n) {
        if (Array.isArray(n)) return n.forEach(walk);
        if (n && typeof n === "object") {
          found.push(n);
          (n.children || []).forEach(walk);
        }
      }
      walk(tree);
      return found;
    },
  };
  api.render();
  return api;
}
const response = (data) => ({ ok: true, json: async () => ({ data }) });
const summary = {
  earningEnabled: false,
  housePolicy: {
    policyVersion: "CFIG-HOUSE-REWARDS-v1.0.0",
    impressionsPerCfig: 5000,
    clicksPerCfig: 25,
    dailyCapApprovedCfig: 10,
    monthlyCapPerPromoterCfig: 100,
    monthlyBudgetUsdCents: 5000,
    maxOutstandingUsdCents: 10000,
  },
  balances: { pending: "0", available: "0", invalid: "0", converted: "0" },
};
test("unavailable rewards are an error, never fabricated zero balances or success", async () => {
  const ui = mount("promoter", async () => ({
    ok: false,
    status: 503,
    json: async () => ({ message: "Evidence unavailable" }),
  }));
  await ui.settle();
  assert.match(ui.text(), /Evidence unavailable/);
  assert.doesNotMatch(ui.text(), /0 \$cfig/);
});
test("unknown and malformed amounts never become cash or zero", () => {
  assert.equal(format.formatCfig(undefined), "Unavailable");
  assert.equal(format.formatCfig("-1"), "Unavailable");
  assert.equal(format.formatCfig("1.25"), "Unavailable");
});
test("promoter page reads owner endpoints only and leaves conversion disabled", async () => {
  const calls = [];
  const ui = mount("promoter", async (url) => {
    calls.push(url);
    return response(
      url.endsWith("/badges")
        ? {
            houseImpressions: { progress: "0", thresholds: [100] },
            houseClicks: { progress: "0", thresholds: [10] },
          }
        : url.includes("transactions") || url.includes("allocations")
          ? { items: [], hasNext: false }
          : summary,
    );
  });
  await ui.settle();
  assert.equal(calls.length, 4);
  assert.ok(calls.every((u) => u.startsWith("/api/v1/promoter/rewards/cfig")));
  assert.match(ui.text(), /0 \$cfig/);
  assert.match(ui.text(), /no guaranteed redeemable value/);
  assert.ok(
    ui
      .nodes()
      .find(
        (n) =>
          n.type === "Button" &&
          text(n) === "Conversion unavailable" &&
          n.props.disabled,
      ),
  );
});
test("fixed precision retains fractional and large integers without floating point", () => {
  assert.equal(format.formatCfig("0"), "0 $cfig");
  assert.equal(format.formatCfig("1000001"), "1.000001 $cfig");
  assert.equal(
    format.formatCfig("9007199254740993000000"),
    "9,007,199,254,740,993 $cfig",
  );
});
test("empty policy list is honest and business rates are not prefilled", async () => {
  const ui = mount("policies", async (url) =>
    response(
      url.endsWith("/policies")
        ? []
        : url.includes("transactions") || url.includes("allocations")
          ? { items: [], hasNext: false }
          : summary,
    ),
  );
  await ui.settle();
  assert.match(ui.text(), /No policies proposed/);
  const inputs = ui.nodes().filter((n) => n.type === "Input");
  assert.equal(inputs.length, 2);
  assert.ok(inputs.every((n) => n.props.value === ""));
});

test("ownership verification and suitability approval remain distinct; TESTING/expired cannot earn", () => {
  const at = Date.parse("2026-11-01T00:00Z"),
    site = {
      verificationStatus: "verified",
      verificationExpiresAt: "2026-11-02T00:00Z",
      policyStatus: "testing",
    };
  assert.match(format.houseRewardEligibility(site, at), /zero \$cfig/);
  assert.match(
    format.houseRewardEligibility({ ...site, policyStatus: "approved" }, at),
    /may qualify/,
  );
  assert.match(
    format.houseRewardEligibility(
      {
        ...site,
        policyStatus: "approved",
        verificationExpiresAt: "2026-10-31",
      },
      at,
    ),
    /verification required/,
  );
  assert.match(
    format.houseRewardEligibility(
      { ...site, policyStatus: "pending_approval" },
      at,
    ),
    /review pending/,
  );
});
test("House badge progress remains visible when monetary earning is zero and conversion stays disabled", async () => {
  const ui = mount("promoter", async (url) =>
    response(
      url.endsWith("/badges")
        ? {
            houseImpressions: { progress: "100", thresholds: [100, 500] },
            houseClicks: { progress: "10", thresholds: [10, 50] },
          }
        : url.includes("transactions") || url.includes("allocations")
          ? { items: [], hasNext: false }
          : summary,
    ),
  );
  await ui.settle();
  assert.match(ui.text(), /House Impression\s+Edition/);
  assert.match(ui.text(), /House Click\s+Edition/);
  assert.match(ui.text(), /Achieved/);
  assert.match(ui.text(), /award no funded points/);
  assert.match(ui.text(), /0 \$cfig/);
});
test("partial and excluded allocations render exact fractional amounts and explicit reasons", async () => {
  const ui = mount("promoter", async (url) =>
    response(
      url.endsWith("/badges")
        ? {
            houseImpressions: { progress: "0", thresholds: [100] },
            houseClicks: { progress: "0", thresholds: [10] },
          }
        : url.includes("allocations")
          ? {
              items: [
                {
                  event_id: "source",
                  day: "2026-11-01",
                  metric: "click",
                  outcome: "MONTHLY_GLOBAL_CAP",
                  entitled: "40000",
                  allocated: "1",
                  badge_eligible: true,
                },
              ],
              hasNext: false,
            }
          : url.includes("transactions")
            ? { items: [], hasNext: false }
            : summary,
    ),
  );
  await ui.settle();
  assert.match(ui.text(), /MONTHLY_GLOBAL_CAP/);
  assert.match(ui.text(), /0.000001 \$cfig/);
  assert.match(ui.text(), /0.04 \$cfig/);
});

test("historical House awards and qualification dates survive prospective thresholds", async () => {
  const ui = mount("promoter", async (url) =>
    response(
      url.endsWith("/badges")
        ? {
            houseImpressions: { progress: "0", thresholds: [500] },
            houseClicks: { progress: "0", thresholds: [50] },
            achievements: [
              {
                badge_key: "house_impression_100",
                badge_title: "House Impression · Tier 1",
                achieved_at: "2026-11-05T00:00:00Z",
              },
            ],
          }
        : url.includes("transactions") || url.includes("allocations")
          ? { items: [], hasNext: false }
          : summary,
    ),
  );
  await ui.settle();
  assert.match(ui.text(), /Award history/);
  assert.match(ui.text(), /2026-11-05T00:00:00.000Z/);
  assert.match(ui.text(), /No funded-point bonus/);
});
