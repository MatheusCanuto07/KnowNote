import type { ColaboradorType } from '$lib/server/schema/schema';

type FormResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: ColaboradorType };

export async function processColaboradorForm(request: Request): Promise<FormResult> {
  const formData = await request.formData();
  const name = formData.get("name")?.toString() ?? "";
  const phoneNumber = formData.get("phoneNumber")?.toString().replace(/\D/g, '') ?? "";
  const active = formData.get("active") === "true" ? true : false;

  const errors: Record<string, string> = {};

  if (!name) errors.name = "Nome é obrigatório";
  if (!phoneNumber || phoneNumber.length !== 11) {
    errors.phoneNumber = "Telefone inválido";
  }
  if (active === undefined) errors.active = "Ativo é obrigatório";

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: { name, phoneNumber, active } as ColaboradorType
  };
}