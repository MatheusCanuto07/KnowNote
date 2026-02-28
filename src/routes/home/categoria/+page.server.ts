import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { ne, desc, and, like, eq, count } from 'drizzle-orm';
import { categoria } from '$lib/server/schema';
import { getDateRangeCondition } from '$lib/utils/date';

export const load = (async ({depends, locals, url}) => {
  depends('getCategorias');

  let page = parseInt(url.searchParams.get("page") ?? "1")
  let pageSize = parseInt(url.searchParams.get("pageSize") ?? "30")
  if (pageSize > 100) pageSize = 100
  if (page < 1) page = 1
  const offset = (page - 1) * pageSize
  
  const activeString = url.searchParams.get('active')
  const active = activeString === 'true' ? true : activeString === 'false' ? false : undefined

  const [categorias, [countResult]] = await db.batch([
    db
      .select()
      .from(categoria)
      .limit(pageSize)
      .offset(offset)
      .where(active ? eq(categoria.active, active) : undefined),

    db
      .select({ count: count(categoria.id) })
      .from(categoria)
      .where(active ? eq(categoria.active, active) : undefined),
  ]);

  const total = countResult.count;

  return {
    categorias,
    total,
  };
}) satisfies PageServerLoad;  