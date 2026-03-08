import type { CategoryType } from '$lib/server/schema/schema';

type FormResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: CategoryType };
export async function processCategoryForm(request: Request): Promise<FormResult> {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const active = formData.get("active") === "true" ? true : false;
  const idTheme = formData.get("idTheme")?.toString() ?? "";

  const errors: Record<string, string> = {};

  if (!name || name.length < 4) errors.name = "Nome invalido";
  if (active === undefined) errors.active = "Ativo e obrigatorio";
  if (description && (description.length < 4 || description.length > 100)) errors.description = "Descricao invalida";
  if (!idTheme) errors.idTheme = "Tema invalido";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, description, active, idTheme: parseInt(idTheme) } as CategoryType,
  };
}
