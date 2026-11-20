import {resolveLocale,type Locale} from './locale';

export interface ServerLocaleInput {
  explicit?:unknown;signedIn?:unknown;anonymous?:unknown;
  headers:{get:(name:string)=>string|null};
  /** Must come from a verified ingress adapter, never from a browser-controlled header. */
  verifiedCountry?:string|null;
}
export function serverLocale(input:ServerLocaleInput):Locale {
  return resolveLocale({explicit:input.explicit,signedIn:input.signedIn,anonymous:input.anonymous,
    trustedCountry:!!input.verifiedCountry,country:input.verifiedCountry,acceptLanguage:input.headers.get('accept-language')});
}
