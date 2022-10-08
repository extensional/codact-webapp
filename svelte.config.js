//import adapter from '@sveltejs/adapter-auto';    //     "@sveltejs/adapter-auto": "next",  // adapter() 
import node from '@sveltejs/adapter-node';  // node()

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node() 
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
