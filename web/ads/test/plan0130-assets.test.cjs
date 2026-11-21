const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
require('../../../shared/api-client/test/load.cjs');
const root=path.resolve(__dirname,'../../..'),nextRequire=require('node:module').createRequire(require.resolve('next/package.json',{paths:[path.join(root,'web/ads')]})),sharp=nextRequire('sharp');
const APPROVED_IMAGE_AD_PRESETS=require('../../../assets/house-ads/plan0130/approved-presets.json');
const manifest=require('../../../assets/house-ads/plan0130/manifest.json');
const {fittingSamples}=require('../src/lib/house-samples.ts');
test('preview matching rejects invalid space, unknown families and incompatible sizes',()=>{
  assert.deepEqual(fittingSamples('missing'),[]);assert.deepEqual(fittingSamples(manifest.families[0],[],0,600),[]);
  assert.deepEqual(fittingSamples(manifest.families[0],['leaderboard'],320,600),[]);
  assert.deepEqual(fittingSamples(manifest.families[0],['unsupported'],970,600),[]);
});
test('all 27 outputs decode identically to immutable sources and satisfy canonical sizes and byte caps',async()=>{
  assert.equal(manifest.assets.length,27);
  for(const family of manifest.families)assert.equal(manifest.assets.filter(item=>item.family===family).length,9);
  for(const asset of manifest.assets){
    const preset=APPROVED_IMAGE_AD_PRESETS.find(item=>item.id===asset.preset);assert.ok(preset);
    assert.equal(asset.width,preset.width);assert.equal(asset.height,preset.height);
    const original=fs.readFileSync(path.join(root,asset.sourceFile)),output=fs.readFileSync(path.join(root,'web/ads/public',asset.url));
    const digest=value=>crypto.createHash('sha256').update(value).digest('hex');
    assert.equal(digest(original),asset.sourceSha256);assert.equal(digest(output),asset.sha256);
    assert.equal(output.length,asset.bytes);assert.ok(output.length<=250000);assert.ok(output.length<=original.length);
    const meta=await sharp(output).metadata();assert.equal(meta.width,preset.width);assert.equal(meta.height,preset.height);
    assert.deepEqual(await sharp(original).ensureAlpha().raw().toBuffer(),await sharp(output).ensureAlpha().raw().toBuffer());
  }
});
test('browser catalog excludes private source and registration metadata',()=>{
  const catalog=require('../src/data/house-samples.json');assert.equal(catalog.assets.length,27);
  for(const asset of catalog.assets){assert.equal(asset.sourceFile,undefined);assert.equal(asset.sourceSha256,undefined);assert.match(asset.url,/^\/img\/house-samples\//);}
  assert.ok(fittingSamples(manifest.families[0],[],320,600).every(item=>item.width<=320&&item.height<=600));
});
