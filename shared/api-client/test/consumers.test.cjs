const { root } = require('./load.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const ts = require('typescript');

test('migrated campaign domain helpers compile against generated DTOs without pulling in live session/UI code', () => {
  const lib = path.resolve(root, '../../web/ads/src/lib');
  const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext,
    strict: true, esModuleInterop: true, resolveJsonModule: true, skipLibCheck: true, noEmit: true };
  const host = ts.createCompilerHost(options);
  const libNorm = path.normalize(lib).toLowerCase();
  host.resolveModuleNames = (names, containing) => names.map(name => name === './session' && path.normalize(containing).toLowerCase().startsWith(libNorm) ?
    { resolvedFileName: path.join(root, 'test/session-stub.d.ts'), extension: ts.Extension.Dts } : ts.resolveModuleName(name, containing, options, host).resolvedModule);
  const program = ts.createProgram([path.join(lib, 'campaigns-api.ts'), path.join(lib, 'ads-api-client.ts')], options, host);
  assert.equal(program.getSourceFiles().some(file => file.fileName.includes('/session/src/')), false);
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => root, getCanonicalFileName: n => n, getNewLine: () => '\n' }));
});
test('migrated TSX call sites retain valid syntax and covered endpoint literals only live in typed operations', () => {
  const components = path.resolve(root, '../../web/ads/src/components');
  for (const name of ['console/CampaignCreationWizard.tsx', 'console/CampaignPage.tsx', 'console/ReplaceCreativeModal.tsx', 'console/ImagePreparation.tsx', 'console/AdminModerationQueue.tsx', 'MediaPreview.tsx', 'ActionHelp.tsx']) {
    const source = fs.readFileSync(path.join(components, name), 'utf8');
    const result = ts.transpileModule(source, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }, reportDiagnostics: true, fileName: name });
    assert.equal((result.diagnostics || []).length, 0, name);
    assert.doesNotMatch(source, /["'`]\/?api\/v1\/(?:campaigns|admin\/ads\/moderation|uploads\/prepared|uploads\/direct|uploads\/assets)/, name);
  }
});

test('changed component call boundaries agree with generated/domain DTOs (component roots only)', () => {
  const components = path.resolve(root, '../../web/ads/src/components');
  const names = ['console/CampaignCreationWizard.tsx', 'console/CampaignPage.tsx', 'console/ReplaceCreativeModal.tsx', 'console/ImagePreparation.tsx', 'console/AdminModerationQueue.tsx', 'MediaPreview.tsx', 'ActionHelp.tsx', 'console/advertiser/CampaignsManager.tsx'];
  const roots = names.map(name => path.join(components, name));
  const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX, strict: true, esModuleInterop: true, resolveJsonModule: true, skipLibCheck: true, noEmit: true };
  const host = ts.createCompilerHost(options);
  host.resolveModuleNames = (names, containing) => names.map(name => name.endsWith('/session') && path.normalize(containing).toLowerCase().includes(`${path.sep}web${path.sep}ads${path.sep}`) ?
    { resolvedFileName: path.join(root, 'test/session-stub.d.ts'), extension: ts.Extension.Dts } : ts.resolveModuleName(name, containing, options, host).resolvedModule);
  const program = ts.createProgram(roots, options, host);
  const selected = new Set(roots.map(name => path.normalize(name)));
  const diagnostics = ts.getPreEmitDiagnostics(program).filter(d => !d.file || selected.has(path.normalize(d.file.fileName)));
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, { getCurrentDirectory: () => root, getCanonicalFileName: n => n, getNewLine: () => '\n' }));
});
