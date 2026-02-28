import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({locals}) => {
  if(locals.user) {
    throw redirect(302, '/home');
  }
  
  return {};
}) satisfies PageServerLoad;
