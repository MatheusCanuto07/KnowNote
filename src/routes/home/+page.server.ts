import { db } from '$lib/server/db';
import { categoryTable, themeTable, textTable } from '$lib/server/schema/schema';
import type { PageServerLoad } from './$types';
import { and, gte, lte, eq } from 'drizzle-orm'

export const load = (async ({url}) => {
  const [themes, categories] = await Promise.all(
    [
      db.select().from(themeTable),
      db.select().from(categoryTable)
    ]
  );

  let themeFiltered = url.searchParams.get("theme");
  let categoryFiltered = url.searchParams.get("category");

  const texts = await db
    .select({
      themeName: themeTable.name,
      categoryName: categoryTable.name,
      textId: textTable.id,
      textName: textTable.name,
      textContent: textTable.content,
    })
    .from(themeTable)
    .innerJoin(categoryTable, eq(categoryTable.idTheme, themeTable.id))
    .innerJoin(textTable, eq(textTable.idCategory, categoryTable.id))
    .where(
      and(
        themeFiltered ? eq(themeTable.id, parseInt(themeFiltered)) : undefined,
        categoryFiltered ? eq(categoryTable.id, parseInt(categoryFiltered)) : undefined,
      ),
    )
    .orderBy(categoryTable.id, textTable.id);


  return { themes, categories, texts };
}) satisfies PageServerLoad;