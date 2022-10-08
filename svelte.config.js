//import adapter from '@sveltejs/adapter-auto';    //     "@sveltejs/adapter-auto": "next",  // adapter() 
import node from '@sveltejs/adapter-node';  // node()

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: node() 
  }    
};
 


export default config;
