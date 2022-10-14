
import * as api from '$lib/codegen';
import { json } from '@sveltejs/kit';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
  
    const {gen, code} = await request.json();

    const prompt = "```"+code+"```\nWhat title would you give to the file containing this code?\nTitle:";

    const completion = await api.openai.createCompletion({
        model: 'text-davinci-002',
        temperature: 1,
        max_tokens: 6,
        n: 1,
        prompt
      });
    const compl = completion.data.choices === undefined ? '' : completion.data.choices[0].text;
    
    function removeQuotes(s){
      s = s.trim();

      if (s[0] == '"')
        s = s.slice(1);
      if (s.at(-1) == '"')
        s = s.slice(0,-1);
      return s;
    }
    const newtitle = compl === undefined ? 'untitled' : removeQuotes(compl);

    prisma.interaction.update({
      where: { gen: gen },
      data : { title: newtitle}
    }).then(t => {console.log("updated")});


    return json({ title: newtitle });
}