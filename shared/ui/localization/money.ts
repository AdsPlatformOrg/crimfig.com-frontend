import {formattingLocale,type Locale} from './locale';

/** Return canonical integer minor units. No floating point or currency conversion. */
export function parseLocalizedMoney(text:string,locale:Locale,precision:number,maxMinor:bigint):bigint {
  if(!Number.isInteger(precision)||precision<0||precision>6||maxMinor<0n)throw new Error('Invalid monetary bounds');
  const numberingSystem=/[\u0660-\u0669]/.test(text)?'arab':/[\u06f0-\u06f9]/.test(text)?'arabext':undefined;
  if(numberingSystem&&locale!=='ar'&&locale!=='ur')throw new Error('Unexpected digits');
  const formatter=new Intl.NumberFormat(formattingLocale(locale),{useGrouping:true,numberingSystem});
  const parts=formatter.formatToParts(1234567.89);
  const group=parts.find(part=>part.type==='group')?.value;
  const decimal=parts.find(part=>part.type==='decimal')?.value??'.';
  const digits=new Intl.NumberFormat(formattingLocale(locale),{useGrouping:false,numberingSystem});
  let value=text.trim();
  for(let digit=0;digit<10;digit++)value=value.split(digits.format(digit)).join(String(digit));
  // Accept decimal input without grouping. Grouped input must round-trip through Intl.
  const segments=value.split(decimal);
  if(segments.length>2)throw new Error('Ambiguous amount');
  const integer=segments[0],fraction=segments[1]??'';
  let plain=integer;
  if(group&&integer.includes(group)){
    plain=integer.split(group).join('');
    if(!/^\d+$/.test(plain)||plain.length>15)throw new Error('Invalid grouping');
    const canonical=new Intl.NumberFormat(formattingLocale(locale),{maximumFractionDigits:0,numberingSystem}).format(BigInt(plain));
    let normalized=canonical;for(let digit=0;digit<10;digit++)normalized=normalized.split(digits.format(digit)).join(String(digit));
    if(normalized!==integer)throw new Error('Invalid grouping');
  }
  if(!/^\d+$/.test(plain)||!/^\d*$/.test(fraction)||fraction.length>precision||text.length>100)throw new Error('Invalid amount or precision');
  const minor=BigInt(plain)*10n**BigInt(precision)+BigInt(fraction.padEnd(precision,'0')||'0');
  if(minor>maxMinor)throw new Error('Amount exceeds limit');
  return minor;
}
