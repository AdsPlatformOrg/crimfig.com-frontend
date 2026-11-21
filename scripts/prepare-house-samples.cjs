const fs=require('node:fs/promises'),path=require('node:path'),crypto=require('node:crypto');
const {createRequire}=require('node:module');
const root=path.resolve(__dirname,'..');
const nextRequire=createRequire(require.resolve('next/package.json',{paths:[path.join(root,'web/ads')]}));
const sharp=nextRequire('sharp');
const families=['sample_04_plaid_man','sample_03_plaid_woman','sample_01_red_turtleneck_growth'];
// Consume the approved backend registry at preparation time; never maintain another size list.
const ts=require('typescript'),vm=require('node:vm'),syncFs=require('node:fs');
const registryPath=path.resolve(root,'../backend/api/ads-api/src/modules/uploads/image-ad-presets.ts');
const registry={exports:{}};
vm.runInNewContext(ts.transpileModule(syncFs.readFileSync(registryPath,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:registry.exports});
const presets=registry.exports.APPROVED_IMAGE_AD_PRESETS.map(item=>[item.id,item.id.replaceAll('_','-'),item.width,item.height]);
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
async function prepare(sourceRoot){
  if(!sourceRoot)throw new Error('Provide the source folder explicitly');
  const assets=[];
  for(const family of families)for(const [preset,stem,width,height] of presets){
    const sourcePath=path.join(path.resolve(sourceRoot),family,'sizes',`${stem}_${width}x${height}.png`);
    const source=await fs.readFile(sourcePath),meta=await sharp(source,{failOn:'warning'}).metadata();
    if(meta.format!=='png'||meta.width!==width||meta.height!==height||(meta.pages??1)!==1)throw new Error(`Invalid source: ${sourcePath}`);
    const originalPath=path.join(root,'assets/house-ads/plan0130/source',family,path.basename(sourcePath));
    await fs.mkdir(path.dirname(originalPath),{recursive:true});
    try{await fs.writeFile(originalPath,source,{flag:'wx'});}catch(error){if(error.code!=='EEXIST'||hash(await fs.readFile(originalPath))!==hash(source))throw error;}
    const webp=await sharp(source).webp({lossless:true,effort:6}).toBuffer();
    const png=await sharp(source).png({compressionLevel:9,effort:10}).toBuffer();
    const choices=[{buffer:source,extension:'png',method:'original'},{buffer:png,extension:'png',method:'lossless-png'},{buffer:webp,extension:'webp',method:'lossless-webp'}].sort((a,b)=>a.buffer.length-b.buffer.length);
    const decode=buffer=>sharp(buffer).ensureAlpha().raw().toBuffer();
    const sourcePixels=await decode(source);
    let selected=choices.find(item=>item.method==='original');
    for(const candidate of choices){if((await decode(candidate.buffer)).equals(sourcePixels)){selected=candidate;break;}}
    if(selected.buffer.length>250000)throw new Error(`Delivery cap exceeded: ${sourcePath}`);
    if(!(await decode(source)).equals(await decode(selected.buffer)))throw new Error(`Pixel mismatch: ${sourcePath}`);
    const relative=`/img/house-samples/${family}/${preset}.${selected.extension}`;
    const outputPath=path.join(root,'web/ads/public',relative);
    await fs.mkdir(path.dirname(outputPath),{recursive:true});await fs.writeFile(outputPath,selected.buffer);
    assets.push({family,preset,width,height,url:relative,mime:`image/${selected.extension}`,bytes:selected.buffer.length,sha256:hash(selected.buffer),
      sourceFile:path.relative(root,originalPath).replaceAll('\\','/'),sourceBytes:source.length,sourceSha256:hash(source),method:selected.method,
      savedBytes:source.length-selected.buffer.length,pixelIdentical:true,registrationStatus:'not-registered',activationStatus:'inactive-not-published'});
  }
  const manifest={version:1,presetPolicyVersion:registry.exports.CURRENT_IMAGE_PRESETS_POLICY_VERSION,encoder:{sharp:sharp.versions.sharp,webp:sharp.versions.webp},families,assets};
  const auditPath=path.join(root,'assets/house-ads/plan0130/manifest.json');
  await fs.writeFile(path.join(root,'assets/house-ads/plan0130/approved-presets.json'),JSON.stringify(registry.exports.APPROVED_IMAGE_AD_PRESETS,null,2)+'\n');
  await fs.writeFile(auditPath,JSON.stringify(manifest,null,2)+'\n');
  const destination=path.join(root,'web/ads/src/data/house-samples.json');
  const publicCatalog={version:1,presetPolicyVersion:manifest.presetPolicyVersion,families,assets:assets.map(({family,preset,width,height,url,mime,bytes,sha256})=>({family,preset,width,height,url,mime,bytes,sha256}))};
  await fs.mkdir(path.dirname(destination),{recursive:true});await fs.writeFile(destination,JSON.stringify(publicCatalog,null,2)+'\n');
  const original=assets.reduce((sum,item)=>sum+item.sourceBytes,0),optimized=assets.reduce((sum,item)=>sum+item.bytes,0);
  console.log(JSON.stringify({count:assets.length,originalBytes:original,optimizedBytes:optimized,savedBytes:original-optimized,savedPercent:Number(((original-optimized)/original*100).toFixed(2)),allPixelIdentical:true}));
}
if(require.main===module)prepare(process.argv[2]).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={prepare,approvedPresets:registry.exports.APPROVED_IMAGE_AD_PRESETS};
