import dotenv from "dotenv";

dotenv.config();

export const configDataBase = {
  databaseUrl: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
};