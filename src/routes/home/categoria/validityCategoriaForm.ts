import type { CategoriaType } from '$lib/server/schema/schema';

type FormResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: CategoriaType };
export async function processCategoriaForm(request: Request): Promise<FormResult> {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const active = formData.get("active") === "true" ? true : false;

  const errors: Record<string, string> = {};

  if (!name || name.length < 4) errors.name = "Nome inválido";
  if (active === undefined) errors.active = "Ativo é obrigatório";
  if (description && (description.length < 30 || description.length > 100)) errors.description = "Descrição inválida";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, description, active } as CategoriaType,
  };
}