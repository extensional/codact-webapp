import { page } from '$app/stores';
import { error, redirect } from '@sveltejs/kit';
import { api } from './api';

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();



/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals, url }) => {
  // locals.userid comes from src/hooks.js
  const gen = url.searchParams.get('gen');
  if (!gen || gen == "") {
    return {
      interactions: [],
      title: "Fresh"
    };
  }
  try {
    const recent = await prisma.interaction.findUnique({
      where: {
        gen: gen
      },
      include: {
        history: true
      }
    });
    if (!recent)
      throw error(404);

    return {
      interactions: recent.history.concat([recent]),
      generatedCode: recent.code,
      title: recent.gen
    };

  } catch (e) {
    throw error(404);
  }
};

/** @type {import('./$types').Actions} */
export const actions = {
  default: async ({ request, locals, params, url }) => {
    const form = await request.formData();

    const selectionStart = parseInt(form.get('selectionStart')?.toString() ?? "0");
    const selectionEnd = parseInt(form.get('selectionEnd')?.toString() ?? "0");
    const question = form.get('question')?.toString() ?? "";
    const gen = url.searchParams.get('gen') ?? "";

    var has_gen = gen && gen != 'null' && gen != undefined && gen != null && gen != 'undefined' && gen != "";

    console.log("BEGINNING: ", question);
    console.log("gen: ", gen);

    const recent = has_gen ? await prisma.interaction.findUnique({
      where: {
        gen: gen
      },
      include: {
        history: true
      }
    }) : null;

    console.log("recent: ", recent);

    /*await api('POST', `codact/${gen}`, {
      text: form.get('text')
    });*/

    const newcode = recent?.code || "";

    const newintr = await prisma.interaction.create(
      {
        data: {
          question: question,
          answer: "yeah I thought so",
          selectionStart: selectionStart,
          selectionEnd: selectionEnd,
          code: newcode,
          history: {
            connect: recent?.history.map(a => {return { gen : a.gen}}).concat(recent ? [{gen : recent.gen}] : []) ?? []
          }
        }
      });
    //console.log("newintr: ", newintr);

    if (!newintr)
      throw error(404);

    return newintr;
  }
};
