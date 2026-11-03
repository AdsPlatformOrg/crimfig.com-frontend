/** Exact first-party navigation mapping. Return parameters never select deployment scope. */
export function ecosystemOrigin(app: 'auth' | 'ads' | 'billing', configured?: string, authHint?: string) {
 const ports={auth:3000,ads:3005,billing:3007};
 const read=(value?:string)=>{if(!value)return null;try{const url=new URL(value);if(url.username||url.password||url.pathname!=='/'||url.search||url.hash)return null;return url;}catch{return null;}};
 const known=(url:URL|null)=>url?.protocol==='https:'&&!url.port&&/^(?:(?:staging-)?(?:auth|ads|billing)|(?:auth|ads|billing)\.staging)\.crimfig\.com$/.test(url.hostname);
 const browser=typeof window==='undefined'?null:read(window.location.origin);
 const selected=read(configured),hint=read(authHint);
 if(browser&&known(browser))return `https://${browser.hostname.startsWith('staging-')||browser.hostname.includes('.staging.')?'staging-':''}${app}.crimfig.com`;
 const local=(url:URL|null)=>!!url&&url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname);
 if(local(browser))return local(selected)?selected!.origin:`http://localhost:${ports[app]}`;
 if(process.env.RAILWAY_ENVIRONMENT_NAME==='production')return `https://${app}.crimfig.com`;
 const staging=process.env.RAILWAY_ENVIRONMENT_NAME==='staging'||[selected,hint].some(url=>known(url)&&(url!.hostname.startsWith('staging-')||url!.hostname.includes('.staging.')));
 if(staging)return `https://staging-${app}.crimfig.com`;
 if(local(selected)&&process.env.RAILWAY_ENVIRONMENT_NAME!=='production')return selected!.origin;
 if(!browser&&!selected&&process.env.NODE_ENV!=='production')return `http://localhost:${ports[app]}`;
 return `https://${app}.crimfig.com`;
}
