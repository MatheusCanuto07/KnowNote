import { auth } from "$lib/auth/auth";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load = (async ({
  request,
  locals,
}) => {}) satisfies PageServerLoad;

export const actions = {
  default: async ({ request }) => {
    const cookies = request.headers.get("cookie") || "";
    const logoutResponse = await auth.api.signOut({ 
      headers: request.headers,
      asResponse: true
    });
    const setCookieHeaders = logoutResponse.headers.getSetCookie();
    redirect(302, "/login");
  },
} satisfies Actions;
