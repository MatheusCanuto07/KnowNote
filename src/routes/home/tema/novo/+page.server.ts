import { db } from '$lib/server/db';
import { themeTable } from '$lib/server/schema';
import type { NewThemeType } from '$lib/server/schema/schema';
import { processThemeForm } from '../validityThemeForm';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const result = await processThemeForm(request);

    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    console.log(result)

    try {
      let insertedNewTheme : NewThemeType = {
        ...result.data,
        idUser: 1,
        createdAt : new Date(),
      }
      await db.insert(themeTable).values(insertedNewTheme);
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