export function useRouter(): {push(href:string):void;replace(href:string):void;refresh():void;back():void};
export function useSearchParams(): Readonly<Pick<URLSearchParams, "get">>;
