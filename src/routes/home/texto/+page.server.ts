import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { count } from 'drizzle-orm';
import { textTable } from '$lib/server/schema';

export const load = (async ({depends, locals, url}) => {
  depends('getTextos');

  let page = parseInt(url.searchParams.get("page") ?? "1")
  let pageSize = parseInt(url.searchParams.get("pageSize") ?? "30")
  if (pageSize > 100) pageSize = 100
  if (page < 1) page = 1
  const offset = (page - 1) * pageSize

  const [texts, [countText]] = await db.batch([
    db
      .select()
      .from(textTable)
      .limit(pageSize)
      .offset(offset),

    db
      .select({ count: count(textTable.id) })
      .from(textTable),
  ]);

  const total = countText.count;
  return {
    texts,
    total,
  };
}) satisfies PageServerLoad;
