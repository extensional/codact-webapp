import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
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
