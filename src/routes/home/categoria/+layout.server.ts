import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({locals}) => {
  const telas = locals.telas
  if(telas.includes("equipe") == false){
    throw redirect(302, '/home');
  }

  return {};
}) satisfies LayoutServerLoad;