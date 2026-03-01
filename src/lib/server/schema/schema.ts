import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const textTable = sqliteTable("text", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content").notNull(),
  
  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  createdBy: text("createdBy").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  updatedBy: text("updatedBy").notNull(),
});


export const categoriaTable = sqliteTable("categoria", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),

  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  createdBy: text("createdBy").notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).notNull(),
  updatedBy: text("updatedBy").notNull(),
});

export type CategoriaType = InferSelectModel<typeof categoriaTable>;
export type NewCategoriaType = InferInsertModel<typeof categoriaTable>;