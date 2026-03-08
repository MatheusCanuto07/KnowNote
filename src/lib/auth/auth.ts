import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../server/db/index";
import * as authSchemas from "../server/schema/auth-schema";
import { sveltekitCookies } from "better-auth/svelte-kit"; 
import { getRequestEvent } from "$app/server";

import { env } from '$env/dynamic/private'

const trustedOrigins = [
  'better-auth://',
  'my-app://',
  'http://localhost:8080',
  'http://localhost:8081',
  env.PUBLIC_URL || 'http://localhost:5173',
  "http://localhost:5173",
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
]

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: authSchemas,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins,
  cookies: {
    secure: process.env.NODE_ENV === "production", // 🔥 obrigatório
    sameSite: "lax", // permite POST do mesmo domínio
    httpOnly: true,
  },
  session: {
    cookieCache: {
      expiresIn: 604800,
      updateAge: 86400,
      enabled: true,
      maxAge: 30000,
      storeSessionInDatabase: true,
      preserveSessionInDatabase: false,
    },
  },
  
  plugins: [
    admin(),
    sveltekitCookies(getRequestEvent)
  ],
});
