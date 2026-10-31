require('./load.cjs');
const {test}=require('node:test');
const assert=require('node:assert/strict');
const Ajv=require('ajv');
const {jsonSchema}=require('../src/validation.ts');
const {responseError}=require('../src/error.ts');

test('decoder rejects missing or mistyped fields even when a field is named like an OpenAPI keyword',()=>{
  const schema=jsonSchema({type:'object',required:['nullable','example','discriminator','xml'],properties:{nullable:{type:'boolean'},example:{type:'string'},discriminator:{type:'integer'},xml:{type:'string',nullable:true}}});
  const validate=new Ajv({strict:false}).compile(schema);
  for(const value of [{},{nullable:'true',example:'text',discriminator:1,xml:null},{nullable:true,example:9,discriminator:1,xml:null}])assert.equal(validate(value),false);
  assert.equal(validate({nullable:true,example:'text',discriminator:1,xml:null}),true);
});

test('malformed response-body correlation cannot hide a valid header ID or expose raw values',()=>{
  const id='11111111-1111-4111-8111-111111111111';
  const error=responseError('Campaigns_create','POST','/api/v1/campaigns',503,{requestId:'SECRET',message:'SECRET'},id);
  assert.doesNotMatch(JSON.stringify(error),/SECRET/);assert.equal(error.outcome,'unknown');assert.equal(error.requestId,id);
  assert.equal(responseError('Read','GET','/api/v1/campaigns',500,{},'malformed').requestId,undefined);
});

test('real contract edits still fail comparison while Windows checkout line endings preserve provenance',async()=>{
  const {contractText,sameContractText}=await import('../scripts/contract-text.mjs');
  const crypto=require('node:crypto');const hash=value=>crypto.createHash('sha256').update(contractText(value)).digest('hex');
  assert.equal(sameContractText('GET /campaigns\r\n','POST /campaigns\n'),false);
  assert.notEqual(hash('field: string\n'),hash('field: number\r\n'));
  assert.equal(sameContractText('GET /campaigns\r\n','GET /campaigns\n'),true);
  assert.equal(hash('field: string\r\n'),hash('field: string\n'));
});
