const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
const session = require("../dist/index.js");

function load(relative, env = {}, extras = {}) {
  const exports = {};
  const source = fs.readFileSync(
    path.resolve(__dirname, "../../../web", relative),
    "utf8",
  );
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => {
      if (name === "./campaign-draft") return { clearCampaignDrafts: () => {} };
      assert.equal(name, "@crimfig/session");
      return extras.session || session;
    },
    URL,
    URLSearchParams,
    process: { env },
    ...extras,
  });
  return exports;
}

test("login and MFA return allow only configured dashboard origins and preserve query/tab", () => {
  const { loginDestination } = load("auth/src/lib/login-return.ts", {
    NODE_ENV: "production",
  });
  const expected = "https://billing.crimfig.com/?view=console&tab=cards";
  assert.equal(
    loginDestination(new URLSearchParams({ return_to: expected })),
    expected,
  );
  for (const bad of [
    "https://evil.example/?x=1",
    "//evil.example",
    "javascript:alert(1)",
    "https://billing.crimfig.com.evil.example",
    "https://user:secret@billing.crimfig.com",
    "https://billing.crimfig.com:444",
  ]) {
    assert.equal(
      loginDestination(new URLSearchParams({ return_to: bad })),
      "/",
    );
  }
});

test("OAuth consent retains parameters and strips the MFA challenge and dashboard return", () => {
  const { loginDestination } = load("auth/src/lib/login-return.ts");
  const destination = loginDestination(
    new URLSearchParams({
      client_id: "app",
      redirect_uri: "https://registered.example/callback",
      state: "state",
      code_challenge: "challenge",
      token: "mfa-secret",
      return_to: "https://evil.example",
    }),
  );
  const params = new URL(destination, "https://auth.crimfig.com").searchParams;
  assert.equal(params.get("state"), "state");
  assert.equal(params.get("code_challenge"), "challenge");
  assert.equal(params.get("token"), null);
  assert.equal(params.get("return_to"), null);
});

test("local login returns use actual dashboard ports", () => {
  const { loginDestination } = load("auth/src/lib/login-return.ts");
  assert.equal(
    loginDestination(
      new URLSearchParams({ return_to: "http://localhost:3005/?view=console" }),
    ),
    "http://localhost:3005/?view=console",
  );
  assert.equal(
    loginDestination(
      new URLSearchParams({ return_to: "http://localhost:3001" }),
    ),
    "/",
  );
});

for (const app of ["ads", "billing"])
  test(`${app} creates one session instance and permits only its own API proxy origin`, async () => {
    const calls = [],
      requests = [];
    const fake = {
      subscribe: () => () => {},
      request: (...args) => {
        requests.push(args);
        return Promise.resolve("response");
      },
    };
    const api = load(
      `${app}/src/lib/session.ts`,
      { NODE_ENV: "production" },
      {
        window: {
          location: {
            origin: `https://${app}.crimfig.com`,
            href: `https://${app}.crimfig.com/?tab=cards#old`,
          },
        },
        session: {
          createSessionClient: (options) => {
            calls.push(options);
            return fake;
          },
        },
      },
    );
    assert.equal(api.dashboardSession(), api.dashboardSession());
    assert.equal(calls.length, 1);
    assert.deepEqual(Array.from(calls[0].apiOrigins), [
      `https://${app}.crimfig.com`,
    ]);
    assert.equal(calls[0].authOrigin, "https://auth.crimfig.com");
    await api.sessionFetch("/api/v1/wallet", { method: "POST" });
    assert.equal(
      requests[0][0].href,
      `https://${app}.crimfig.com/api/v1/wallet`,
    );
    assert.equal(requests[0][1].method, "POST");
    const login = new URL(api.loginUrl());
    assert.equal(login.origin, "https://auth.crimfig.com");
    assert.equal(
      login.searchParams.get("return_to"),
      `https://${app}.crimfig.com/?tab=cards&view=console`,
    );
  });

test("Billing wallet maps integer cents, preserves zero and rejects malformed/foreign shapes", () => {
  const { walletView } = load("billing/src/lib/wallet-view.ts");
  const data = {
    usd: { availableCents: 0, lockedCents: 125, totalCents: 125 },
    ngnEquivalent: { exchangeRate: 1600, rateSource: "test" },
    updatedAt: "2026-10-21T12:00:00Z",
  };
  const view = walletView(data);
  assert.equal(view.availableUsd, 0);
  assert.equal(view.lockedUsd, 1.25);
  assert.equal(view.totalUsd, 1.25);
  for (const bad of [
    null,
    { availableUsd: 500 },
    { ...data, usd: { ...data.usd, totalCents: 1 } },
    { ...data, usd: { ...data.usd, availableCents: "0" } },
    { ...data, ngnEquivalent: { exchangeRate: 0, rateSource: "test" } },
  ]) {
    assert.throws(() => walletView(bad));
  }
});

for (const app of ["auth", "ads", "billing"])
  test(`${app} theme bootstrap rejects invalid values and tolerates blocked storage before content paint`, () => {
    const exports = {};
    const code = ts.transpileModule(
      fs.readFileSync(
        path.resolve(__dirname, `../../../web/${app}/src/lib/theme.ts`),
        "utf8",
      ),
      { compilerOptions: { module: ts.ModuleKind.CommonJS } },
    ).outputText;
    vm.runInNewContext(code, { exports });
    for (const [saved, expected] of [
      [null, "light"],
      ["light", "light"],
      ["dark", "dark"],
      ["invalid", "light"],
      ["DARK", "light"],
    ]) {
      let actual;
      vm.runInNewContext(exports.themeBootstrap, {
        localStorage: { getItem: () => saved },
        document: {
          documentElement: {
            setAttribute: (key, value) => {
              assert.equal(key, "data-theme");
              actual = value;
            },
          },
        },
      });
      assert.equal(actual, expected);
    }
    let actual;
    vm.runInNewContext(exports.themeBootstrap, {
      get localStorage() {
        throw Error("blocked");
      },
      document: {
        documentElement: {
          setAttribute: (_key, value) => {
            actual = value;
          },
        },
      },
    });
    assert.equal(actual, "light");
  });

test("consent uses one same-origin memory session and never sends bearer to a callback origin", async () => {
  const calls = [],
    sent = [];
  const fake = {
    subscribe: () => () => {},
    request: (...args) => {
      sent.push(args);
      return Promise.resolve("ok");
    },
  };
  const api = load(
    "auth/src/lib/consent.ts",
    { NODE_ENV: "production" },
    {
      window: { location: { origin: "https://auth.crimfig.com" } },
      session: {
        createSessionClient: (options) => {
          calls.push(options);
          return fake;
        },
      },
    },
  );
  assert.equal(api.consentSession(), api.consentSession());
  assert.equal(calls.length, 1);
  assert.equal(calls[0].authOrigin, "https://auth.crimfig.com");
  assert.deepEqual(Array.from(calls[0].apiOrigins), [
    "https://auth.crimfig.com",
  ]);
  assert.equal(sent.length, 0);
});

test("consent posts explicit parameters once and uses only a matching server code/state", async () => {
  const { approveConsent } = load("auth/src/lib/consent.ts");
  const params = new URLSearchParams({
    client_id: "registered",
    redirect_uri: "https://app.example/callback?existing=1",
    state: "bound",
    code_challenge: "a".repeat(43),
    code_challenge_method: "S256",
    token: "do-not-send",
  });
  const calls = [];
  const url = await approveConsent(params, async (path, init) => {
    calls.push({ path, init });
    return Response.json({ code: "server-code", state: "bound" });
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].path, "/api/v1/oauth/authorize/approve");
  assert.equal(calls[0].init.method, "POST");
  const body = JSON.parse(calls[0].init.body);
  assert.equal(body.code_challenge, "a".repeat(43));
  assert.equal(body.token, undefined);
  const callback = new URL(url);
  assert.equal(callback.origin, "https://app.example");
  assert.equal(callback.searchParams.get("existing"), "1");
  assert.equal(callback.searchParams.get("code"), "server-code");
  assert.equal(callback.searchParams.get("state"), "bound");
});

test("consent rejects malformed/conflicting parameters before approval", async () => {
  const { approveConsent } = load("auth/src/lib/consent.ts");
  for (const query of [
    "client_id=x",
    "client_id=x&redirect_uri=javascript:alert(1)",
    "client_id=x&redirect_uri=https://user:pass@app.example/cb",
    "client_id=x&redirect_uri=https://app.example/cb%23fragment",
    "client_id=x&redirect_uri=http://public.example/cb",
    "client_id=x&client_id=y&redirect_uri=https://app.example/cb",
    "client_id=x&redirect_uri=https://app.example/cb&response_type=token",
  ]) {
    let calls = 0;
    await assert.rejects(
      approveConsent(new URLSearchParams(query), async () => {
        calls++;
        return Response.json({ code: "bad" });
      }),
    );
    assert.equal(calls, 0);
  }
});

test("consent never retries rejected or uncertain approval and cannot navigate on malformed success", async () => {
  const { approveConsent } = load("auth/src/lib/consent.ts");
  for (const outcome of [
    () => Response.json({ code: "code", state: "wrong" }),
    () => Response.json({ state: "bound" }),
    () => Response.json({ code: "", state: "bound" }),
    () => new Response("no", { status: 401 }),
    () => new Response("no", { status: 503 }),
    () => {
      throw new Error("lost acknowledgement");
    },
  ]) {
    let calls = 0;
    await assert.rejects(
      approveConsent(
        new URLSearchParams({
          client_id: "app",
          redirect_uri: "https://app.example/cb",
          state: "bound",
          code_challenge: "a".repeat(43),
          code_challenge_method: "S256",
        }),
        async () => {
          calls++;
          return outcome();
        },
      ),
    );
    assert.equal(calls, 1);
  }
});

test("consent requires S256 and reports only supported explicitly requested scopes", async () => {
  const { consentRequest, approveConsent } = load("auth/src/lib/consent.ts");
  const valid = {
    client_id: "app",
    redirect_uri: "https://app.example/cb",
    code_challenge: "a".repeat(43),
    code_challenge_method: "S256",
  };
  assert.equal(consentRequest(new URLSearchParams(valid)).scope, "openid");
  assert.equal(
    consentRequest(
      new URLSearchParams({ ...valid, scope: "email email profile" }),
    ).scope,
    "email profile",
  );
  for (const changed of [
    { code_challenge: "" },
    { code_challenge_method: "plain" },
    { code_challenge: "short" },
    { scope: "billing:write" },
  ]) {
    let calls = 0;
    await assert.rejects(
      approveConsent(
        new URLSearchParams({ ...valid, ...changed }),
        async () => {
          calls++;
          return Response.json({});
        },
      ),
    );
    assert.equal(calls, 0);
  }
});
