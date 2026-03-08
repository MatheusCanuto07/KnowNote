import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const themeTable = sqliteTable("theme", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),

  idUser: integer("idUser").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type ThemeType = InferSelectModel<typeof themeTable>;
export type NewThemeType = InferInsertModel<typeof themeTable>;

export const categoryTable = sqliteTable("category", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  active: integer("active", { mode: "boolean" }).default(true).notNull(),

  idUser : integer("idUser").notNull(),
  idTheme: integer("idTheme").references(() => themeTable.id, {
    onDelete: "cascade",
  }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type CategoryType = InferSelectModel<typeof categoryTable>;
export type NewCategoryType = InferInsertModel<typeof categoryTable>;

export const textTable = sqliteTable("text", {
  id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  name : text("name").notNull(),
  content: text("content").notNull(),

  active: integer("active", { mode: "boolean" }).default(true).notNull(),
  idCategory : integer("idCategory").references(() => categoryTable.id, { onDelete: "cascade" }).notNull(),
  idUser: integer("idUser").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }),
});

export type TextType = InferSelectModel<typeof textTable>;
export type NewTextType = InferInsertModel<typeof textTable>;
