import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { themeTable, type ThemeType } from "$lib/server/schema/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { processThemeForm } from "../validityThemeForm";

export const load = (async ({ params, locals }) => {
  if (!params.id) {
    return fail(400, {
      success: false,
      message: "Tema não encontrado",
    });
  }

  const idTema = parseInt(params.id);

  const [theme] = await db
      .select()
      .from(themeTable)
      .where(eq(themeTable.id, idTema))    
  ;
  
  return {
    theme,
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals, params }) => {
    const result = await processThemeForm(request);
    
    let id = parseInt(params.id);
    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    if (!id) {
      return fail(400, {
        success: false,
        message: "Tema não encontrado",
      });
    }

    try {
      let editedTheme : ThemeType = {
        ...result.data,
        id,
      }
      await db.update(themeTable).set(editedTheme).where(eq(themeTable.id, editedTheme.id));
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