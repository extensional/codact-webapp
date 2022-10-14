
import * as api from '$lib/codegen';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
  
    /*
    const prompt = "here is a prompt";

    const completion = await api.openai.createCompletion({
        model: 'text-davinci-002',
        temperature: 1,
        max_tokens: 5,
        n: 1,
        prompt
      });
    const compl = completion.data.choices === undefined ? '' : completion.data.choices[0].text;
    */


    return json({ title: "untitled" }); // compl === undefined ? '' : compl;
}