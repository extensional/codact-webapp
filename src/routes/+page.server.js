import { page } from '$app/stores';
import { error, redirect } from '@sveltejs/kit';
import { api } from './api';

/**
 * @typedef {{
 *   uid: string;
 *   created_at: Date;
 *   text: string;
 *   done: boolean;
 *   pending_delete: boolean;
 * }} Todo
 */

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals, url }) => {
  // locals.userid comes from src/hooks.js
  const gen = url.searchParams.get('gen');
  if (gen == null || gen == undefined || gen == "") {
      return {
          interactions: [{ question: "why is the world green?", 
                           answer: "because I like it that way", 
                           gen: "1" 
                         }],
          generatedCode : "function foo() { }",
          title : "fresh"
      };
  }

  const response = await api('GET', `codact/${gen}`);
  
  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return {
      /** @type {Todo[]} */
      interactions: [],
      generatedCode : "",
      title : "404"
    };
  }

  if (response.status === 200) {
    return {
      /** @type {Todo[]} */
      interactions: await response.json(),
      generatedCode : "here is code",
      title : gen
    };
  }

  throw error(response.status);
};

/** @type {import('./$types').Action} */
export const POST = async ({ request, locals, params, url}) => {
  const form = await request.formData();
  console.log("OMG:", form.get('selection'));
  const gen = url.searchParams.get('gen');

  await api('POST', `codact/${gen}`, {
    text: form.get('text')
  });


  const newgen = gen != 'null' && gen != undefined && gen != null && gen != 'undefined' ? gen + 1 : "1";
  throw redirect(303, `?gen=${newgen}`);
};
