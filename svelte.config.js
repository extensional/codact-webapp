//import adapter from '@sveltejs/adapter-auto';    //     "@sveltejs/adapter-auto": "next",  // adapter() 
import node from '@sveltejs/adapter-node';  // node()
import autoPreprocess from 'svelte-preprocess';


/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node() 
  },
  preprocess: autoPreprocess()
};
 


export default config;
