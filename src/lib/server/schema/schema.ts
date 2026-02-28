import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const categoria = sqliteTable("categoria", {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  descricao: text("descricao"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
});

export type CategoriaType = InferSelectModel<typeof categoria>;

export const demonstrativoDeDescarga = sqliteTable("demonstrativo_de_descarga", {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),

  clienteNome: text("cliente_nome"),
  clienteCnpj: text("cliente_cnpj"),

  nomeMotorista: text("nome_motorista"),
  veiculoPlaca: text("veiculo_placa"),
  veiculoTipo: text("veiculo_tipo"),

  tipoCarga: text("tipo_carga"),

  formaPagamento: text("forma_pagamento").notNull(),
  dataDescarga: integer("data_descarga", { mode: "timestamp_ms" }).notNull(),
  dataDescargaTimestamp: integer("data_descarga_timestamp", { mode: "timestamp_ms" }),
  status: text("status").notNull(),
  valorTotal : integer("valor_total").notNull(),
  observacao : text("observacao"),

  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  createdBy: text("created_by").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .defaultNow()
    .notNull(),
  updatedBy: text("updated_by"),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date()),
});

export type DemonstrativoDeDescargaType = InferSelectModel<typeof demonstrativoDeDescarga>;
export type NewDemonstrativoDeDescargaType = InferInsertModel<typeof demonstrativoDeDescarga>;
export type UpdateDemonstrativoDeDescargaType = Partial<NewDemonstrativoDeDescargaType>;