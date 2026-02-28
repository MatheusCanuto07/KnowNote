import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import {
  colaborador,
  type ColaboradorType
} from "$lib/server/schema/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { processColaboradorForm } from "../validityColaboradorForm";

export const load = (async ({ params, locals }) => {
  if (!params.id) {
    return fail(400, {
      success: false,
      message: "Colaborador não encontrado",
    });
  }

  const idColaborador = parseInt(params.id);

  const [col] = await db
      .select()
      .from(colaborador)
      .where(eq(colaborador.id, idColaborador))    
  ;
  
  return {
    colaborador: col,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals, params }) => {
    const result = await processColaboradorForm(request);
    
    let id = parseInt(params.id);
    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    if (!id) {
      return fail(400, {
        success: false,
        message: "Colaborador não encontrado",
      });
    }

    try {
      let editedColaborador : ColaboradorType = {
        ...result.data,
        id,
        updatedBy: locals.user?.email || "suporte@gmail.com"
      }
      await db.update(colaborador).set(editedColaborador).where(eq(colaborador.id, editedColaborador.id));
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