import { browser, dev } from '$app/environment';


export const csr = false;


// since there's no dynamic data here, we can prerender
// it so that it gets served as a static asset in prod
export const prerender = false;
