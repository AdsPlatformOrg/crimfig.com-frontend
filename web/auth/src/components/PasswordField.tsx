'use client';
import { Eye, EyeOff } from 'lucide-react';
import { Input, type InputProps } from './ui/input';
export function PasswordField({visible,onToggle,...props}:InputProps&{visible:boolean;onToggle:()=>void}){
 return <div className="auth-password"><Input {...props} type={visible?'text':'password'} /><button type="button" disabled={props.disabled} className="auth-password-toggle" aria-label={visible?'Hide password':'Show password'} aria-pressed={visible} aria-controls={props.id} onClick={onToggle}>{visible?<EyeOff size={18} aria-hidden="true"/>:<Eye size={18} aria-hidden="true"/>}</button></div>;
}
