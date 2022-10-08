import { page } from '$app/stores';
import { error, redirect } from '@sveltejs/kit';
import { api } from './api';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals, url }) => {
  // locals.userid comes from src/hooks.js
  const gen = url.searchParams.get('gen');
  if (!gen || gen == '') {
    return {
      interactions: [],
      title: 'Fresh'
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
    if (!recent) throw error(404);

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

    const selectionStart = parseInt(form.get('selectionStart')?.toString() ?? '0');
    const selectionEnd = parseInt(form.get('selectionEnd')?.toString() ?? '0');
    const question = form.get('question')?.toString() ?? '';
    const gen = url.searchParams.get('gen') ?? '';

    var has_gen =
      gen && gen != 'null' && gen != undefined && gen != null && gen != 'undefined' && gen != '';

    console.log('BEGINNING: ', question);
    console.log('gen: ', gen);

    const recent = has_gen
      ? await prisma.interaction.findUnique({
          where: {
            gen: gen
          },
          include: {
            history: true
          }
        })
      : null;

    console.log('recent: ', recent);
    const codeSelection = recent?.code.slice(selectionStart, selectionEnd);
    //
    const response = await api('POST', `prompt/question`, {
      question: form.get('text')
    });
    const is_info = response.body;
    if (is_info) {
      let response = await api('POST', `prompt/answer`, {
        textInDoc: recent?.code,
        textInSelection: codeSelection,
        text: form.get('text')
      });
      const aout = response.body;
      const newintr = await prisma.interaction.create({
        data: {
          question: question,
          answer: aout,
          selectionStart: selectionStart,
          selectionEnd: selectionEnd,
          code: recent?.code || '',
          history: {
            connect:
              recent?.history
                .map((a) => {
                  return { gen: a.gen };
                })
                .concat(recent ? [{ gen: recent.gen }] : []) ?? []
          }
        }
      });
      // setPrompt('Codact: How else can I help you?');
      if (!newintr) throw error(404);
      return;
    }
    let res = await api('POST', `prompt/completion`, {
      textInDoc: recent?.code,
      textInSelection: codeSelection,
      text: form.get('text')
    });
    const aout = res.body;

    // setPrompt('Codact: How else can I help you?');

    await api('POST', `prompt/`, {
      codeSelection,
      code: recent?.code,
      text: form.get('text')
    });
    let newCode;
    if (selectionStart && selectionEnd) {
      newCode = replaceRange(recent?.code, selectionStart, selectionEnd, aout);
    } else {
      newCode = aout;
    }

    const newintr = await prisma.interaction.create({
      data: {
        question: question,
        answer: 'I generated the code you asked for!',
        selectionStart: selectionStart,
        selectionEnd: selectionEnd,
        code: newCode,
        history: {
          connect:
            recent?.history
              .map((a) => {
                return { gen: a.gen };
              })
              .concat(recent ? [{ gen: recent.gen }] : []) ?? []
        }
      }
    });
    //console.log("newintr: ", newintr);

    if (!newintr) throw error(404);

    return newintr;
  }
};

function replaceRange(s, start, end, substitute) {
  return s.substring(0, start) + substitute + s.substring(end);
}
