import { defineConfig } from "drizzle-kit";

if (!process.env.TURSO_DATABASE_URL) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  schema: "./src/lib/server/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    // authToken: process.env.TURSO_AUTH_TOKEN,
    url: process.env.TURSO_DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
