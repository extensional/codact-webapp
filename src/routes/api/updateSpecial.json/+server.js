
import * as api from '$lib/codegen';
import { json } from '@sveltejs/kit';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
  
    const {gen, highlight} = await request.json();

    prisma.interaction.update({
      where: { gen},
      data : { highlight}
    }).then(a => console.log("a: "+highlight));

    return json({});
}