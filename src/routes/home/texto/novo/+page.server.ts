import { db } from '$lib/server/db';
import { categoryTable, textTable } from '$lib/server/schema';
import type { NewTextType } from '$lib/server/schema/schema';
import { processTextForm } from '../validityTextForm';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async () => {

  const categories = await db.select().from(categoryTable);

  return {
    categories
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const result = await processTextForm(request);

    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    try {
      let insertedNewText : NewTextType = {
        ...result.data,
        idUser: 1,
        createdAt : new Date(),
      }
      console.log(insertedNewText)
      await db.insert(textTable).values(insertedNewText);
      return { success: true };
    } catch (e) {
      console.log(e);
      return fail(400, {
        success: false,
        exception: "Ocorreu uma exceção não tratada, favor contatar o suporte.",
      });
    }
  }
};
