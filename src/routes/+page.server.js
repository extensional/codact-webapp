import { error } from '@sveltejs/kit';
import * as api from '$lib/codegen';

import {startCode} from './codeGlobals.js';

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

async function getCodeAndAnswer(recent, selectionStart, selectionEnd, q) {
  const selection = recent?.code.slice(selectionStart, selectionEnd) || '';

  const isInfo = await api.promptYesNo(q);

  const code = recent?.code || startCode;
  let answer;
  let newCode;
  const setup = {code, selection, selectionStart, selectionEnd, q };
  if (isInfo) {
    answer = await api.answer(setup);
    newCode = code;
  } else {
    let aout = await api.completionEdit(setup);
    answer = 'sure!';
    newCode = replaceRange(code, selectionStart, selectionEnd, (aout ?? [""])[0]);
  }
  return { newCode, answer };
}
