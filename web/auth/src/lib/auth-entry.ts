import { loginDestination } from './login-return';
export const passwordGuidance='Use 8–128 characters with uppercase, lowercase, a number and a special character.';
export function signupPasswordValid(value:string){return value.length>=8&&value.length<=128&&/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(value);}
export function authEntryLink(path:'/login'|'/signup'|'/forgot-password',search:string){
 const source=new URLSearchParams(search),target=new URLSearchParams();
 for(const key of ['client_id','redirect_uri','response_type','scope','state','code_challenge','code_challenge_method','prompt']){const value=source.get(key);if(value)target.set(key,value);}
 const returned=source.get('return_to');if(returned){const safe=loginDestination(new URLSearchParams({return_to:returned}));if(safe!=='/')target.set('return_to',safe);}
 return path+(target.size?'?'+target.toString():'');
}
export async function authEntryResponse(response:Response){
 let data:any;try{data=await response.json();}catch{throw Error('The service returned an unreadable response. Please try again.');}
 if(!response.ok){const message=response.status===429?'Too many attempts. Please wait before trying again.':response.status===401?'Sign-in details were not accepted. Please check and try again.':response.status>=500?'The service is temporarily unavailable. Please try again.':'Please check your details and try again.';throw Error(message);}
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('The service returned an unreadable response. Please try again.');
 return data;
}
