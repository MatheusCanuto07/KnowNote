import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { ne, desc, and, like, eq, count } from 'drizzle-orm';
import { themeTable } from '$lib/server/schema';

export const load = (async ({depends, locals, url}) => {
  depends('getThemas');

  let page = parseInt(url.searchParams.get("page") ?? "1")
  let pageSize = parseInt(url.searchParams.get("pageSize") ?? "30")
  if (pageSize > 100) pageSize = 100
  if (page < 1) page = 1
  const offset = (page - 1) * pageSize
  
  const activeString = url.searchParams.get('active')
  const active = activeString === 'true' ? true : activeString === 'false' ? false : undefined

  const [themes, [countTheme]] = await db.batch([
    db
      .select()
      .from(themeTable)
      .limit(pageSize)
      .offset(offset)
      .where(active ? eq(themeTable.active, active) : undefined),

    db
      .select({ count: count(themeTable.id) })
      .from(themeTable)
      .where(active ? eq(themeTable.active, active) : undefined),
  ]);

  const total = countTheme.count;
  return {
    themes,
    total,
  };
}) satisfies PageServerLoad;  