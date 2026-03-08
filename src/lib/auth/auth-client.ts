import { createAuthClient } from "better-auth/svelte"
import { browser } from "$app/environment";
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: browser ? window.location.origin : process.env.VITE_AUTH_URL,
  autoSignIn: false,
  plugins: [
    adminClient()
  ]  
});