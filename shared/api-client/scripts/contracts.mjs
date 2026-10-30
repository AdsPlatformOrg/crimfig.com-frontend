import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import openapiTS, { astToString } from 'openapi-typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workspace = path.resolve(root, '../..');
const backend = path.resolve(workspace, '../backend');
const requireBackend = createRequire(path.join(backend, 'package.json'));
const { exportContract } = requireBackend('./scripts/export-ads-contract.cjs');
const mode = process.argv[2] || 'check';
if (!['generate', 'check'].includes(mode)) throw new Error('Use generate or check');
const result = await exportContract();
const sourceHash = crypto.createHash('sha256');
for (const relative of ['api/ads-api/src/contracts/ads-contract.ts', 'api/ads-api/src/contracts/api-configuration.ts',
  ...['campaigns', 'uploads', 'moderation'].map(name => `api/ads-api/src/modules/${name}/${name}.controller.ts`)]) {
  sourceHash.update(relative).update(fs.readFileSync(path.join(backend, relative)));
}
const manifest = JSON.stringify({ ...result.manifest, sourceSha256: sourceHash.digest('hex'), generator: 'openapi-typescript@7.13.0' }, null, 2) + '\n';
const types = astToString(await openapiTS(result.document));
const outputs = new Map([
  [path.join(backend, 'contracts/openapi/ads-v1.json'), result.text],
  [path.join(backend, 'contracts/openapi/ads-v1.manifest.json'), manifest],
  [path.join(root, 'src/generated/ads-v1.json'), result.text],
  [path.join(root, 'src/generated/ads-v1.manifest.json'), manifest],
  [path.join(root, 'src/generated/ads-v1.ts'), types],
]);
const stale = [];
for (const [filename, contents] of outputs) {
  if (mode === 'generate') { fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, contents); }
  else if (!fs.existsSync(filename) || fs.readFileSync(filename, 'utf8') !== contents) stale.push(path.relative(workspace, filename));
}
if (stale.length) throw new Error(`Stale API contract/client: ${stale.join(', ')}. Run pnpm api:generate; fix DTO/response metadata at the backend source, never generated files.`);
console.log(`${mode}: ${result.manifest.operations.length} operations; schema ${result.manifest.sha256.slice(0, 12)}`);
if (mode === 'check') {
  const typescript = path.join(root, 'node_modules/typescript/bin/tsc');
  for (const args of [[typescript, '--project', path.join(root, 'tsconfig.contract.json'), '--noEmit'],
    ['--test', ...fs.readdirSync(path.join(root, 'test')).filter(name => name.endsWith('.test.cjs')).map(name => path.join(root, 'test', name))]]) {
    const child = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
    if (child.error || child.status !== 0) { process.exitCode = child.status || 1; break; }
  }
}
