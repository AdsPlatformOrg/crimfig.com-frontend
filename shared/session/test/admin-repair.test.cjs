const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  ts = require("typescript");
const root = path.resolve(__dirname, "../../../");
const text = (n) =>
  n == null
    ? ""
    : typeof n === "string" || typeof n === "number"
      ? String(n)
      : Array.isArray(n)
        ? n.map(text).join("")
        : n.children?.map(text).join("") || "";
function mount(file, name, props, request, extra = {}) {
  const state = [],
    effects = [];
  let cursor = 0,
    tree;
  const location = {
    origin: "https://staging.example",
    pathname: "/admin/house-ads",
    search: "",
    href: "https://staging.example/admin/house-ads",
  };
  const react = {
    createElement: (type, props, ...children) => ({
      type,
      props: props || {},
      children,
    }),
    useState(initial) {
      const i = cursor++;
      if (!(i in state))
        state[i] = typeof initial === "function" ? initial() : initial;
      return [
        state[i],
        (value) =>
          (state[i] = typeof value === "function" ? value(state[i]) : value),
      ];
    },
    useRef(initial) {
      const i = cursor++;
      return state[i] || (state[i] = { current: initial });
    },
    useCallback(fn) {
      cursor++;
      return fn;
    },
    useEffect(fn, deps) {
      const i = cursor++;
      if (!state[i] || deps?.some((v, j) => v !== state[i].deps?.[j])) {
        state[i]?.cleanup?.();
        state[i] = { deps };
        effects.push(() => (state[i].cleanup = fn()));
      }
    },
  };
  const exports = {},
    generic = new Proxy({}, { get: (_, k) => String(k) });
  const registryExports = {};
  vm.runInNewContext(
    ts.transpileModule(
      fs.readFileSync(
        path.join(root, "web/ads/src/lib/workspace-navigation.ts"),
        "utf8",
      ),
      { compilerOptions: { module: ts.ModuleKind.CommonJS } },
    ).outputText,
    { exports: registryExports, require: () => generic },
  );
  const code = ts.transpileModule(
    fs.readFileSync(path.join(root, file), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.React,
        esModuleInterop: true,
      },
    },
  ).outputText;
  const window = {
    location,
    history: {
      pushState: (_, __, url) => {
        const u = new URL(url, location.href);
        Object.assign(location, {
          pathname: u.pathname,
          search: u.search,
          href: u.href,
        });
      },
    },
    addEventListener() {},
    removeEventListener() {},
  };
  vm.runInNewContext(code, {
    React: react,
    exports,
    URL,
    URLSearchParams,
    window,
    setTimeout,
    clearTimeout,
    navigator: {
      clipboard: {
        writeText: async () => {
          throw Error("denied");
        },
      },
    },
    require: (n) =>
      n.endsWith("/theme")
        ? { validTheme: (v) => v === "light" || v === "dark" }
        : n.includes("workspace-navigation")
          ? registryExports
          : n === "react"
            ? react
            : n === "next/link"
              ? { __esModule: true, default: "Link" }
              : n.includes("session")
                ? { sessionFetch: request }
                : n.includes("consent")
                  ? { consentSession: () => ({ request }) }
                  : generic,
    ...extra,
  });
  const api = {
    exports,
    render() {
      cursor = 0;
      tree = exports[name](props);
      while (effects.length) effects.shift()();
      return tree;
    },
    async settle() {
      await new Promise(setImmediate);
      this.render();
    },
    nodes() {
      const out = [];
      const visit = (n) => {
        if (Array.isArray(n)) return n.forEach(visit);
        if (n && typeof n === "object") {
          out.push(n);
          n.children?.forEach(visit);
        }
      };
      visit(tree);
      return out;
    },
    text() {
      return text(tree);
    },
    button(label) {
      return this.nodes().find((n) => n.type === "Button" && text(n) === label);
    },
  };
  api.render();
  return api;
}
const response = (data, ok = true) => ({
  ok,
  status: ok ? 200 : 500,
  headers: { get: () => "request-123" },
  json: async () => ({ data }),
});
async function loaded(...args) {
  const m = mount(...args);
  for (let i = 0; i < 5; i++) await m.settle();
  return m;
}
test("House fetch failure does not claim measured zero or empty catalog", async () => {
  const m = await loaded(
    "web/ads/src/components/console/AdminHouseAdsView.tsx",
    "AdminHouseAdsView",
    {},
    async () => response(null, false),
  );
  assert.match(m.text(), /request-123/);
  assert.doesNotMatch(
    m.text(),
    /No house creatives configured|0.00%|Total House Serves/,
  );
  assert.ok(m.button("Retry"));
});
test("successful empty catalog is distinct from a failure", async () => {
  const m = await loaded(
    "web/ads/src/components/console/AdminHouseAdsView.tsx",
    "AdminHouseAdsView",
    {},
    async () => response([]),
  );
  assert.match(m.text(), /No house creatives configured/);
  assert.doesNotMatch(m.text(), /Cannot load/);
});
test("creative management exposes performance drill-down and media-specific video field", async () => {
  const m = await loaded(
    "web/ads/src/components/console/AdminHouseAdsView.tsx",
    "AdminHouseAdsView",
    {},
    async () =>
      response([
        {
          id: "creative",
          title: "Test",
          adType: "text",
          format: "banner",
          isActive: true,
        },
      ]),
  );
  assert.ok(
    m
      .nodes()
      .some((n) => n.props.href === "/admin/house-ads/creative/performance"),
  );
  m.button("Add House Ad").props.onClick();
  await m.settle();
  m.nodes()
    .find((n) => n.type === "select" && n.props.value === "image")
    .props.onChange({ target: { value: "video" } });
  await m.settle();
  assert.match(m.text(), /Video URL/);
});
test("performance is a separate report and propagates creative filters to website links", async () => {
  const calls = [];
  const data = {
    summary: {
      serves: 4,
      renders: 3,
      impressions: 2,
      viewable: 1,
      clicks: 1,
      ctr: 50,
    },
    items: [
      {
        id: "site",
        label: "jed.com.ng",
        serves: 4,
        renders: 3,
        impressions: 2,
        clicks: 1,
        ctr: 50,
        promoterId: "promoter",
      },
    ],
    series: [],
    inventory: [],
    page: 1,
    total: 1,
    limit: 25,
    asOf: "2026-10-31T00:00:00Z",
    definitions: { basis: "Cohort", coverage: "Historical" },
  };
  const m = await loaded(
    "web/ads/src/components/console/AdminPerformanceView.tsx",
    "AdminPerformanceView",
    { kind: "creative", id: "creative" },
    async (url) => {
      calls.push(url);
      return response(data);
    },
  );
  assert.match(m.text(), /Creative Performance on Promoter Websites/);
  assert.ok(
    calls.some((u) => u.includes("/house-creatives/creative/analytics")),
  );
  assert.ok(
    m
      .nodes()
      .some((n) =>
        n.props.href?.includes(
          "/admin/websites/site/performance?creativeId=creative",
        ),
      ),
  );
  assert.doesNotMatch(m.text(), /Add House Ad/);
});
test("failed report does not show zero metrics", async () => {
  const m = await loaded(
    "web/ads/src/components/console/AdminPerformanceView.tsx",
    "AdminPerformanceView",
    { kind: "house" },
    async () => response(null, false),
  );
  assert.match(m.text(), /Report unavailable/);
  assert.doesNotMatch(m.text(), /0.00%|Serves0/);
});
test("diagnostic history failure is actionable rather than a successful empty result", async () => {
  const m = await loaded(
    "web/auth/src/components/ErrorRequestDiagnostics.tsx",
    "ErrorRequestDiagnostics",
    { environment: "staging", service: "ads-api" },
    async () => response(null, false),
  );
  assert.match(m.text(), /Request history unavailable/);
  assert.doesNotMatch(m.text(), /No retained requests match/);
  assert.ok(m.button("Refresh / Retry"));
});
test("Admin and Promoter detail routes remain in their own workspace", () => {
  const m = mount(
    "web/ads/src/components/ProtectedWorkspace.tsx",
    "resolveWorkspaceContext",
    "/admin/house-ads/abc/performance",
    async () => {},
  );
  assert.deepEqual(
    Array.from(
      m.exports.resolveWorkspaceContext("/admin/websites/abc/performance"),
    ),
    ["admin", "admin_websites"],
  );
  assert.deepEqual(
    Array.from(m.exports.resolveWorkspaceContext("/admin/ad-slots/abc")),
    ["admin", "admin_slots"],
  );
  assert.deepEqual(
    Array.from(m.exports.resolveWorkspaceContext("/promoter/slots/abc")),
    ["promoter", "slots"],
  );
  assert.equal(
    m.exports.resolveWorkspaceContext("/administrator")[0],
    "advertiser",
  );
});
test("shared utilities preserve explicit workspace and reporting groups are nested", () => {
  const m = mount(
    "web/ads/src/lib/workspace-navigation.ts",
    "workspaceNavigation",
    "admin",
    async () => {},
  );
  assert.equal(
    m.exports.resolveWorkspaceContext("/settings", "promoter")[0],
    "promoter",
  );
  assert.equal(
    m.exports.resolveWorkspaceContext("/settings", "admin")[0],
    "admin",
  );
  const admin = m.exports.workspaceNavigation("admin");
  const house = admin.flatMap((g) => g.items).find((i) => i.id === "house");
  assert.deepEqual(Array.from(house.children.map((i) => i.href)), [
    "/admin/house-ads",
    "/admin/house-ads/performance",
  ]);
  for (const role of ["admin", "promoter"]) {
    const leaves = m.exports
      .workspaceNavigation(role)
      .flatMap((g) => g.items.flatMap((i) => i.children || [i]));
    assert.ok(
      !leaves.some((i) =>
        ["/campaigns", "/billing", "/profile"].includes(i.href),
      ),
    );
  }
});
test("missing or insufficient grants do not expose admin reporting links", () => {
  const m = mount(
    "web/ads/src/lib/workspace-navigation.ts",
    "workspaceNavigation",
    "admin",
    async () => {},
  );
  assert.equal(m.exports.workspaceNavigation("admin", []).length, 0);
  const reviewer = m.exports
    .workspaceNavigation("admin", ["ads_reviewer"])
    .flatMap((g) => g.items);
  assert.ok(reviewer.some((i) => i.id === "moderation"));
  assert.ok(
    !reviewer.some((i) => i.id === "house" || i.id === "delivery_reports"),
  );
});
test("theme footer control defaults light and persists the user choice", async () => {
  const attrs = { "data-theme": "light" },
    saved = {};
  const document = {
    documentElement: {
      setAttribute: (k, v) => (attrs[k] = v),
      getAttribute: (k) => attrs[k],
    },
  };
  const localStorage = {
    getItem: (k) => saved[k] || null,
    setItem: (k, v) => (saved[k] = v),
  };
  class MutationObserver {
    observe() {}
    disconnect() {}
  }
  const m = await loaded(
    "web/auth/src/components/ThemeSwitcher.tsx",
    "ThemeSwitcher",
    { showLabel: true },
    {},
    { document, localStorage, MutationObserver },
  );
  assert.equal(attrs["data-theme"], "light");
  m.nodes()
    .find((n) => n.props["aria-label"] === "Switch to Dark Theme")
    .props.onClick();
  await m.settle();
  assert.equal(attrs["data-theme"], "dark");
  assert.equal(saved["crimfig-theme"], "dark");
  m.nodes()
    .find((n) => n.props["aria-label"] === "Switch to Light Theme")
    .props.onClick();
  await m.settle();
  assert.equal(attrs["data-theme"], "light");
});
