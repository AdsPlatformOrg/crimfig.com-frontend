'use client';
import React, { useState } from 'react';
import Link from 'next/link';
export interface CrimFigLogoProps {
  variant?: 'icon' | 'brand' | 'full' | 'red-badge'; size?: number;
  app?: string; appBadge?: string; subtext?: string; centered?: boolean;
  href?: string; priority?: boolean; className?: string; style?: React.CSSProperties;
}
export function CrimFigLogo({variant='icon',size=40,app,centered=false,href,priority=true,className='',style}: CrimFigLogoProps) {
  const [failed,setFailed]=useState(false);
  const artwork = variant==='brand'||variant==='full';
  const image = (src:string, cls='') => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={href ? '' : 'CrimFig'} width={artwork ? Math.round(size*2.915) : variant==='red-badge' ? Math.round(size*2.552) : size} height={size}
      loading={priority ? 'eager' : 'lazy'} className={cls} onError={()=>setFailed(true)}
      style={{height:size,width:'auto',objectFit:'contain'}} />
  );
  const content=failed ? <span>CrimFig</span> : artwork ? <>{image('/img/logo.png','cf-brand-light')}{image('/img/logo-red.png','cf-brand-dark')}</> : image(variant==='red-badge'?'/img/logo-red.png':'/img/logo-icon.png');
  const props={className:`cf-brand ${className}`,style:{...style,margin:centered?'0 auto':undefined}};
  return href ? <Link {...props} href={href} aria-label={`CrimFig${app ? ` ${app}` : ''} home`}>{content}</Link> : <span {...props}>{content}</span>;
}
