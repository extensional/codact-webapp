import { error } from '@sveltejs/kit';

import { PrismaClient } from '@prisma/client';

import { dev } from '$app/environment';

const prisma = new PrismaClient();

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params, locals, url }) => {
  // locals.userid comes from src/hooks.js
  const gen = url.searchParams.get('gen');

  try {
    if (!gen || gen == '') {
      let recents = await prisma.interaction.findMany({
        where: dev ?{ highlight : true } : { highlight : true , debug: false },
        select: {
          gen: true,
          title: true,
          question: true,
          code: true,
          _count: { select: {children : true}}
        }
      });
      if (!recents) throw error(404);
      
      function value(a){
        return a._count.children;
      }

      return {
        interactions: recents.sort((a,b)=> value(a) - value(b)).slice(-20),
        title: "Leaderboard",
        question: ""
      };
    } else {

      console.log("SUP");
      const recent = await prisma.interaction.findUnique({
        where: {
          gen: gen
        },
        select: {
          gen: true,
          title: true,
          question: true,
          successors: {
            select: {
              gen: true,
              title: true,
              question: true,
              code: true,
              _count: { select: {successors : true}}
            }
          }
        }
      });
      if (!recent) throw error(404);
      return {
        interactions: recent.successors.filter(s => s._count.successors > 0),
        title: recent.title,
        question: recent.question
      };
    }
  } catch (e) {
    console.log("E:", e);
    throw error(404);
  }

};