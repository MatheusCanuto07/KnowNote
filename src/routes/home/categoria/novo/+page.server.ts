import { db } from '$lib/server/db';
import { colaborador } from '$lib/server/schema';
import type { NewColaboradorType } from '$lib/server/schema/schema';
import { processColaboradorForm } from '../validityColaboradorForm';
import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
  return {};
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals }) => {
    const result = await processColaboradorForm(request);

    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    try {
      let insertedColaborador : NewColaboradorType = {
        ...result.data,
        createdBy: locals.user?.email || "suporte@gmail.com"
      }
      await db.insert(colaborador).values(insertedColaborador);
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