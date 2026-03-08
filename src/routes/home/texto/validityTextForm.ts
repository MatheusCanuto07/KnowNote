import type { TextType } from '$lib/server/schema/schema';

type FormResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: TextType };

export async function processTextForm(request: Request): Promise<FormResult> {
  const formData = await request.formData();
  const content = formData.get("content")?.toString() ?? "";
  const name = formData.get("name")?.toString() ?? "";
  const idCategory = formData.get("idCategory")?.toString() ?? "";

  const errors: Record<string, string> = {};

  if (!content || content.length < 5) errors.content = "Conteúdo inválido (mínimo 5 caracteres)";
  if (!name || name.length < 3) errors.name = "Nome inválido (mínimo 3 caracteres)";
  if (!idCategory || isNaN(parseInt(idCategory))) errors.idCategory = "Categoria inválida";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { content, name, idCategory: parseInt(idCategory) } as TextType,
  };
}
