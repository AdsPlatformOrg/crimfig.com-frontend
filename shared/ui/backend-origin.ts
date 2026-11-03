/** Server/build proxy boundary. Staging requires an explicitly bound upstream. */
export function backendOrigin(app:'auth'|'ads',env:Record<string,string|undefined>){
 const publicValues=[env.NEXT_PUBLIC_AUTH_WEB_URL,env.NEXT_PUBLIC_ADS_WEB_URL,env.NEXT_PUBLIC_ADS_URL,env.NEXT_PUBLIC_BILLING_WEB_URL];
 const stageHint=publicValues.some(value=>{try{return !!value&&/^https:\/\/staging-(auth|ads|billing)\.crimfig\.com\/?$/.test(value);}catch{return false;}});
 const staging=env.RAILWAY_ENVIRONMENT_NAME==='staging'||stageHint;
 if(env.RAILWAY_ENVIRONMENT_NAME==='production'&&stageHint)throw Error('Production deployment has staging public origins');
 const configured=app==='auth'?(env.AUTH_API_BACKEND_URL||env.AUTH_API_URL||env.NEXT_PUBLIC_AUTH_API_URL||env.NEXT_PUBLIC_API_URL):(env.ADS_API_BACKEND_URL||env.NEXT_PUBLIC_ADS_API_URL);
 if(staging&&!configured)throw Error(`${app} staging backend origin is required`);
 const production=env.RAILWAY_ENVIRONMENT_NAME==='production'||env.NODE_ENV==='production';
 const fallback=production?(app==='auth'?'https://auth-api-production-8e03.up.railway.app':'https://ads-api-production-d889.up.railway.app'):`http://127.0.0.1:${app==='auth'?4000:3004}`;
 let url:URL;try{url=new URL(configured||fallback);}catch{throw Error(`${app} backend origin is invalid`);}
 if(url.username||url.password||url.pathname!=='/'||url.search||url.hash||!['https:','http:'].includes(url.protocol))throw Error(`${app} backend origin is invalid`);
 if(staging&&(/(^|[-.])production([-.]|$)/i.test(url.hostname)||url.hostname.includes('.staging.')||/^(auth|ads|billing)\.crimfig\.com$/.test(url.hostname)))throw Error(`${app} staging backend points to production or legacy host`);
 if((staging||production)&&url.protocol!=='https:'&&!url.hostname.endsWith('.railway.internal'))throw Error(`${app} deployed backend requires HTTPS or private Railway transport`);
 return url.origin;
}
