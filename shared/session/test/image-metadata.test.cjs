const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
// Next's declared image dependency supplies real encoded fixtures without a cross-repository dependency.
const sharp=require('node:module').createRequire(require.resolve('next/package.json',{paths:[path.resolve(__dirname,'../../../web/ads')]}))('sharp');
const output={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.resolve(__dirname,'../../../web/ads/src/lib/image-metadata.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:output,Blob,Uint8Array,DataView});
for(const [format,mime]of [['webp','image/webp'],['png','image/png'],['jpeg','image/jpeg']])test(`${format}: remove metadata without recompressing or changing decoded pixels`,async()=>{
 const original=await sharp({create:{width:128,height:96,channels:3,background:'#d4143a'}}).withMetadata({orientation:1}).toFormat(format,{quality:97}).toBuffer();
 assert.ok((await sharp(original).metadata()).icc);
 const clean=Buffer.from(await(await output.stripImageMetadata(new Blob([original],{type:mime}))).arrayBuffer());
 const metadata=await sharp(clean).metadata();assert.equal(metadata.exif,undefined);assert.equal(metadata.icc,undefined);assert.equal(metadata.width,128);assert.equal(metadata.height,96);
 assert.deepEqual(await sharp(clean).raw().toBuffer(),await sharp(original).raw().toBuffer());assert.ok(clean.length<original.length);
});
