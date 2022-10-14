
import * as api from '$lib/codegen';
import { json } from '@sveltejs/kit';


export async function POST({ request }) {
  
    const {gen, code} = await request.json();

    const prompt = "```"+code+"```\nWhat title would you give to the file containing this code?\nTitle:";

    const completion = await api.openai.createCompletion({
        model: 'text-davinci-002',
        temperature: 1,
        max_tokens: 10,
        n: 1,
        prompt
      });
    const compl = completion.data.choices === undefined ? '' : completion.data.choices[0].text;
    
    function removeQuotes(s){
      if (s[0] == '"')
        s = s.slice(1);
      if (s.at(-1) == '"')
        s = s.slice(0,-1);
      return s;
    }
    

    return json({ title: compl === undefined ? 'untitled' : removeQuotes(compl) });
}