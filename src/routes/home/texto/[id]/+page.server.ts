import type { Actions, PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import { textTable, type TextType, categoryTable } from "$lib/server/schema/schema";
import { eq } from "drizzle-orm";
import { fail } from "@sveltejs/kit";
import { processTextForm } from "../validityTextForm";

export const load = (async ({ params, locals }) => {
  if (!params.id) {
    return fail(400, {
      success: false,
      message: "Texto não encontrado",
    });
  }

  const idText = parseInt(params.id);

  const [text] = await db
      .select()
      .from(textTable)
      .where(eq(textTable.id, idText))
  ;

  const categories = await db.select().from(categoryTable);

  return {
    text,
    categories
  };
}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request, locals, params }) => {
    const result = await processTextForm(request);

    let id = parseInt(params.id);
    if (!result.success) {
      return fail(422, { success: false, errors: result.errors });
    }

    if (!id) {
      return fail(400, {
        success: false,
        message: "Texto não encontrado",
      });
    }

    try {
      let editedText : TextType = {
        ...result.data,
        id,
      }
      await db.update(textTable).set(editedText).where(eq(textTable.id, editedText.id));
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
