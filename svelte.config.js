//import adapter from '@sveltejs/adapter-auto';         "@sveltejs/adapter-auto": "next",
import node from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node() //adapter()
    // Override http methods in the Todo forms
      /*
    methodOverride: {
      allowed: ['PATCH', 'DELETE']
    } */
  },
  optimizeDeps: {
    exclude: ["codemirror", "@codemirror/language-javascript" /* ... */],
  }
};

export default config;
