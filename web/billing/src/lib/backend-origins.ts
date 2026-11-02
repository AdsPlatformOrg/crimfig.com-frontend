/** Server-only Next rewrite configuration. No staging fallback may point at production. */
export function billingBackends(env:Record<string,string|undefined>){
 const stageHint=[env.NEXT_PUBLIC_AUTH_WEB_URL,env.NEXT_PUBLIC_BILLING_WEB_URL,env.NEXT_PUBLIC_ADS_WEB_URL].some(value=>/\/\/staging-|\.staging\./i.test(value||''));
 if(env.RAILWAY_ENVIRONMENT_NAME==='production'&&stageHint)throw Error('Billing deployment origins conflict: production environment has staging public origins.');
 const localHint=[env.NEXT_PUBLIC_AUTH_WEB_URL,env.NEXT_PUBLIC_BILLING_WEB_URL].some(value=>/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value||''));
 if(env.RAILWAY_ENVIRONMENT_NAME==='production'&&localHint)throw Error('Billing production origins conflict with local public origins.');
 const staging=env.RAILWAY_ENVIRONMENT_NAME==='staging'||stageHint;
 const local=!staging&&env.RAILWAY_ENVIRONMENT_NAME!=='production'&&localHint;
 const production=env.RAILWAY_ENVIRONMENT_NAME==='production'||(!local&&env.NODE_ENV==='production');
 function resolve(value:string|undefined,service:'Billing'|'Auth',fallback:string){
  if(staging&&!value)throw Error(`${service} API backend origin is required for staging; production fallback is disabled.`);
  let url:URL;try{url=new URL(value||fallback);}catch{throw Error(`${service} API backend origin is invalid.`);}
  if(url.username||url.password||url.search||url.hash||url.pathname!=='/'||!['https:','http:'].includes(url.protocol))throw Error(`${service} API backend origin is invalid.`);
  if(staging&&(url.hostname.includes('.staging.')||/(^|[-.])production([-.]|$)/i.test(url.hostname)||['auth.crimfig.com','billing.crimfig.com','ads.crimfig.com'].includes(url.hostname)))throw Error(`${service} API backend origin points to production or a legacy staging hostname.`);
  if((staging||production)&&url.protocol==='http:'&&!url.hostname.endsWith('.railway.internal'))throw Error(`${service} API backend origin requires HTTPS or private Railway transport.`);
  return url.origin;
 }
 return {billing:resolve(env.BILLING_API_BACKEND_URL||env.NEXT_PUBLIC_BILLING_API_URL,'Billing',production?'https://billing-api-production-bb4c.up.railway.app':'http://127.0.0.1:3008'),
  auth:resolve(env.AUTH_API_BACKEND_URL||env.AUTH_API_URL||env.NEXT_PUBLIC_AUTH_API_URL||env.NEXT_PUBLIC_API_URL,'Auth',production?'https://auth-api-production-8e03.up.railway.app':'http://127.0.0.1:4000')};
}
