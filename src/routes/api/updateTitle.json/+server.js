
import * as api from '$lib/codegen';
import { json } from '@sveltejs/kit';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
  
    const {gen, newtitle} = await request.json();

    prisma.interaction.update({
      where: { gen: gen },
      data : { title: newtitle}
    }).then(t => {console.log("updated")});

    return json({});
}