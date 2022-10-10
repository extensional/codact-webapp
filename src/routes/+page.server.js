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

    //console.log('BEGINNING: ', question);

    var has_gen =
      gen && gen != 'null' && gen != undefined && gen != null && gen != 'undefined' && gen != '';

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

    const { newCode, answer } = await getCodeAndAnswer(
      recent,
      selectionStart,
      selectionEnd,
      question
    );

    const newintr = await prisma.interaction.create({
      data: {
        question,
        answer,
        selectionStart,
        selectionEnd,
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
    if (!newintr) throw error(404);

    return newintr;
  }
};

function replaceRange(s, start, end, substitute) {
  return s.substring(0, start) + substitute + s.substring(end, s.length);
}

async function getCodeAndAnswer(recent, selectionStart, selectionEnd, question) {
  const codeSelection = recent?.code.slice(selectionStart, selectionEnd) || '';
  const response = await api('POST', `prompt/question`, {
    question
  });
  const isInfo = await response.json();
  const currentCode = recent?.code || '';
  let answer;
  let newCode;

  if (isInfo) {
    const response = await api('POST', `prompt/answer`, {
      textInDoc: recent?.code || '',
      textInSelection: codeSelection,
      question
    });
    answer = await response.json();
    newCode = currentCode;
  } else {
    let res = await api('POST', `prompt/completion`, {
      textInDoc: recent?.code || '',
      textInSelection: codeSelection,
      question
    });
    const aout = await res.json();
    answer = 'I generated the code you asked for!';
    newCode = replaceRange(currentCode, selectionStart, selectionEnd, aout[0]);
  }
  return { newCode, answer };
}
