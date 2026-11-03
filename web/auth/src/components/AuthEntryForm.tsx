'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { withBrowserRefreshLock } from '@crimfig/session';
import { getApiUrl } from '../lib/config';
import { loginDestination } from '../lib/login-return';
import { authEntryLink, authEntryResponse, passwordGuidance, signupPasswordValid } from '../lib/auth-entry';
import { AuthBrandHeader } from './AuthBrandHeader';
import { PasswordField } from './PasswordField';
import { Alert } from './ui/alert';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
export function AuthEntryForm({mode}:{mode:'login'|'signup'}){
 const signup=mode==='signup',busy=useRef(false);
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[phone,setPhone]=useState('');
 const [visible,setVisible]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState(''),[created,setCreated]=useState(false),[search,setSearch]=useState('');
 const alive=useRef(true);
 useEffect(()=>{alive.current=true;setSearch(window.location.search);return()=>{alive.current=false;};},[]);
 async function submit(event:React.FormEvent){
  event.preventDefault();if(busy.current)return;setVisible(false);setError('');
  if(!email.trim()||!password){setError('Enter your email address and password.');return;}
  if(signup&&!signupPasswordValid(password)){setError(passwordGuidance);return;}
  busy.current=true;setLoading(true);
  try{
   const request=()=>fetch(getApiUrl(`/api/v1/auth/${mode}`),{method:'POST',credentials:'include',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim(),password,...(signup&&phone?{phone}:{})})});
   const response=signup?await request():await withBrowserRefreshLock(window.location.origin,request);
   const data=await authEntryResponse(response);if(!alive.current)return;
   if(signup){if(typeof data.userId!=='string'||!data.userId)throw Error('Sign-in could not be confirmed. Please try again.');setPassword('');setCreated(true);return;}
   const params=new URLSearchParams(window.location.search);
   if(data.requiresMfa===true){if(typeof data.mfaChallengeToken!=='string'||!data.mfaChallengeToken||data.mfaChallengeToken.length>4096)throw Error('Sign-in could not be confirmed. Please try again.');const next=authEntryLink('/login',window.location.search);const mfa=new URLSearchParams(next.split('?')[1]||'');mfa.set('token',data.mfaChallengeToken);window.location.assign(`/mfa-challenge?${mfa.toString()}`);}
   else {if(data.requiresMfa!==false||typeof data.accessToken!=='string'||!data.accessToken)throw Error('Sign-in could not be confirmed. Please try again.');window.location.assign(loginDestination(params));}
  }catch(problem){if(alive.current)setError(problem instanceof Error&&['The service returned an unreadable response. Please try again.','Too many attempts. Please wait before trying again.','Sign-in details were not accepted. Please check and try again.','The service is temporarily unavailable. Please try again.','Please check your details and try again.','Sign-in could not be confirmed. Please try again.'].includes(problem.message)?problem.message:'Unable to connect. Please try again.');}
  finally{busy.current=false;if(alive.current){setVisible(false);setLoading(false);}}
 }
 const prefix=signup?'signup':'login';
 return <main className="auth-entry" data-theme="light"><Card className="auth-entry-card">
  <AuthBrandHeader appearance="light" title={signup?'Create account':'Sign in'} subtitle={signup?'One account for the CrimFig ecosystem.':'Welcome back to CrimFig.'}/>
  {error&&<Alert variant="destructive">{error}</Alert>}
  {created?<div><Alert variant="success">Account created. Check your email to verify your address before signing in.</Alert><Button asChild variant="secondary"><Link href={authEntryLink('/login',search)}>Back to sign in</Link></Button></div>:<form onSubmit={submit} aria-busy={loading}>
   <div><label htmlFor={`${prefix}-email`}>Email address</label><Input id={`${prefix}-email`} type="email" autoComplete="email" required value={email} onChange={event=>setEmail(event.target.value)} disabled={loading}/></div>
   {signup&&<div><label htmlFor="signup-phone">Phone number <span>(optional)</span></label><Input id="signup-phone" type="tel" autoComplete="tel" value={phone} onChange={event=>setPhone(event.target.value)} disabled={loading}/></div>}
   <div><div className="auth-entry-label"><label htmlFor={`${prefix}-password`}>Password</label>{!signup&&<Link href={authEntryLink('/forgot-password',search)}>Forgot password?</Link>}</div>
    <PasswordField id={`${prefix}-password`} visible={visible} onToggle={()=>setVisible(value=>!value)} value={password} onChange={event=>setPassword(event.target.value)} required autoComplete={signup?'new-password':'current-password'} minLength={signup?8:undefined} maxLength={signup?128:undefined} aria-describedby={signup?'signup-password-help':undefined} disabled={loading}/>
    {signup&&<p id="signup-password-help" className="auth-entry-help">{passwordGuidance}</p>}
   </div><Button type="submit" loading={loading} disabled={loading}>{loading?(signup?'Creating account…':'Signing in…'):(signup?'Create account':'Sign in')}</Button>
  </form>}
  <p className="auth-entry-footer">{signup?'Already have an account?':'New to CrimFig?'} <Link href={authEntryLink(signup?'/login':'/signup',search)}>{signup?'Sign in':'Create account'}</Link></p>
 </Card></main>;
}
