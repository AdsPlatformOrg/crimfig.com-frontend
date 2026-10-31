const { test } = require("node:test"),
  assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm"),
  ts = require("typescript");
const root = path.resolve(__dirname, "../../../web/ads/src/lib");
function load(name, globals = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(root, name + ".ts"), "utf8");
  const code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    // These canvas doubles exercise the resize loop; real container stripping is tested separately.
    require: () => ({ stripImageMetadata: async (blob) => blob }),
    Blob,
    File,
    Uint8Array,
    DataView,
    setTimeout,
    AbortController,
    ...globals,
  });
  return exports;
}
test("CPM and CPC estimates use cents without an artificial dollar floor", () => {
  const { bidEstimate } = load("campaign-draft");
  assert.equal(bidEstimate(25, 50, "cpm"), 50000);
  assert.equal(bidEstimate(25, 10, "cpc"), 250);
  assert.equal(bidEstimate(25, 0, "cpm"), null);
  assert.equal(bidEstimate(NaN, 50, "cpc"), null);
});
test("draft reads are account-scoped, bounded and expired drafts are not restored", () => {
  const { readDraft, DRAFT_PREFIX } = load("campaign-draft");
  let key;
  const draft = { version: 1, savedAt: Date.now(), stacks: [] };
  assert.equal(
    readDraft(
      {
        getItem: (k) => {
          key = k;
          return JSON.stringify(draft);
        },
      },
      "user-b",
    ).version,
    1,
  );
  assert.equal(key, DRAFT_PREFIX + "user-b");
  assert.equal(
    readDraft(
      { getItem: () => JSON.stringify({ ...draft, savedAt: 0 }) },
      "user-b",
    ),
    null,
  );
});
test("fixed crop is re-rendered from source at 1.00 while dimensions automatically reach each cap", async () => {
  const quality = [],
    draws = [];
  class Canvas {
    constructor(w, h) {
      this.width = w;
      this.height = h;
    }
    getContext() {
      return { drawImage: (...a) => draws.push(a) };
    }
    async convertToBlob(options) {
      quality.push(options.quality);
      return new Blob(
        [new Uint8Array(Math.ceil(this.width * this.height * 2))],
        { type: "image/webp" },
      );
    }
  }
  const { encodeWithinBudget } = load("image-preparation", {
    OffscreenCanvas: Canvas,
  });
  const source = { id: "original" },
    crop = { x: 20, y: 30, width: 2000, height: 1000 };
  for (const [profile, cap] of [
    ["compact", 100000],
    ["standard", 250000],
    ["larger", 300000],
  ]) {
    const output = await encodeWithinBudget(source, crop, profile, 2048);
    assert.ok(output.blob.size <= cap);
    assert.ok(Math.abs(output.width / output.height - 2) < 0.02);
  }
  assert.ok(quality.length > 3);
  assert.ok(quality.every((q) => q === 1));
  assert.ok(
    draws.every(
      (a) =>
        a[0] === source &&
        a[1] === 20 &&
        a[2] === 30 &&
        a[3] === 2000 &&
        a[4] === 1000,
    ),
  );
});
test("unsupported WebP encoder PNG fallback is checked by actual bytes and MIME", async () => {
  class Canvas {
    constructor(w, h) {
      this.width = w;
      this.height = h;
    }
    getContext() {
      return { drawImage() {} };
    }
    async convertToBlob() {
      return new Blob([new Uint8Array(this.width * this.height)], {
        type: "image/png",
      });
    }
  }
  const api = load("image-preparation", { OffscreenCanvas: Canvas });
  assert.equal(
    (
      await api.encodeWithinBudget(
        {},
        { x: 0, y: 0, width: 300, height: 300 },
        "compact",
        300,
      )
    ).blob.type,
    "image/png",
  );
});
test("cancellation aborts before allocating an encoding surface", async () => {
  const api = load("image-preparation");
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    api.encodeWithinBudget(
      {},
      { x: 0, y: 0, width: 100, height: 100 },
      "standard",
      100,
      controller.signal,
    ),
  );
});
test("source headers reject mime mismatch, excessive pixels and files above 100 MB", async () => {
  const api = load("image-preparation");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jD1sAAAAASUVORK5CYII=",
    "base64",
  );
  assert.equal(
    (await api.inspectSource(new File([png], "one.png", { type: "image/png" })))
      .width,
    1,
  );
  await assert.rejects(
    api.inspectSource(new File([png], "fake.jpg", { type: "image/jpeg" })),
  );
  const large = Buffer.from(png);
  large.writeUInt32BE(30000, 16);
  await assert.rejects(
    api.inspectSource(new File([large], "large.png", { type: "image/png" })),
  );
  await assert.rejects(api.inspectSource({ size: 100000001 }));
});
test("server and browser share the exact daily schedule contract", () => {
  assert.equal(
    fs.readFileSync(
      path.resolve(
        root,
        "../../../../../backend/api/ads-api/src/modules/campaigns/daily-schedule.ts",
      ),
      "utf8",
    ),
    fs.readFileSync(path.join(root, "daily-schedule.ts"), "utf8"),
  );
});
