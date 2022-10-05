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
export const load = async ({ params, locals }) => {
  // locals.userid comes from src/hooks.js
  const response = await api('GET', `todos/${locals.userid}`);
  
  if (response.status === 404) {
    // user hasn't created a todo list.
    // start with an empty array
    return {
      /** @type {Todo[]} */
      todos: [],
      generatedCode : "WOW",
      slug: params.slug
    };
  }

  if (response.status === 200) {
    return {
      /** @type {Todo[]} */
      todos: (await response.json()).slice(0,params.slug),
      generatedCode : "wtf is this",
      slug: params.slug
    };
  }

  throw error(response.status);
};

/** @type {import('./$types').Action} */
export const POST = async ({ request, locals, params }) => {
  const form = await request.formData();
  await api('POST', `todos/${locals.userid}`, {
    text: form.get('text')
  });
  
  throw redirect(303, `${params.slug + 1}`);
};
