export type Theme = 'light' | 'dark';
export function validTheme(value: unknown): value is Theme { return value === 'light' || value === 'dark'; }
// Runs synchronously before page content; storage may be unavailable or contain invalid values.
export const themeBootstrap = `(function(){var theme='light';try{var saved=localStorage.getItem('crimfig-theme');if(saved==='light'||saved==='dark')theme=saved;}catch(e){}document.documentElement.setAttribute('data-theme',theme);})();`;
