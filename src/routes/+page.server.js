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
    const selection = form.get('selection')?.toString() ?? "";
    const question = form.get('question')?.toString() ?? "";
    const gen = url.searchParams.get('gen') ?? "";
    /*
    await api('POST', `codact/${gen}`, {
      text: form.get('text')
    }); */
    var has_gen = gen && gen != 'null' && gen != undefined && gen != null && gen != 'undefined' && gen != "";

    const recent = has_gen ? await prisma.interaction.findUnique({
      where: {
        gen: gen
      },
      include: {
        history: true
      }
    }) : null;

    const newcode = recent?.code || "";

    const newintr = await prisma.interaction.create(
      {
        data: {
          question: question,
          answer: "yeah I thought so",
          selection: selection,
          code: newcode,
          history: {
            connect: recent?.history.map(a => {return { gen : a.gen}}).concat(recent ? [{gen : recent.gen}] : []) ?? []
          }
        }
      });

    if (!newintr)
      throw error(404);

    return newintr;
  }
};
