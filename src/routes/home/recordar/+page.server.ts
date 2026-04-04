import { db } from "$lib/server/db";
import { categoryTable, textTable, vocabularyTable } from "$lib/server/schema";
import { and, count, eq, isNull, lte, sql } from "drizzle-orm";
import { fail, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type ReviewGrade = "again" | "hard" | "good" | "easy";

function getUserId(userId?: string): number {
  const parsed = Number(userId);
  return Number.isFinite(parsed) ? parsed : 1;
}

function normalizeText(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarityPercent(a: string, b: string): number {
  const normalizedA = normalizeText(a);
  const normalizedB = normalizeText(b);

  if (!normalizedA && !normalizedB) return 100;
  if (!normalizedA || !normalizedB) return 0;

  const tokensA = new Set(normalizedA.split(" "));
  const tokensB = new Set(normalizedB.split(" "));

  let intersection = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) intersection += 1;
  }

  const union = new Set([...tokensA, ...tokensB]).size;
  if (union === 0) return 0;

  return Math.round((intersection / union) * 100);
}

function stripHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applySm2(
  currentRepetitions: number,
  currentIntervalDays: number,
  currentEaseFactorPct: number,
  currentLapses: number,
  grade: ReviewGrade,
) {
  const gradeToQuality: Record<ReviewGrade, number> = {
    again: 0,
    hard: 3,
    good: 4,
    easy: 5,
  };

  const quality = gradeToQuality[grade];
  let repetitions = currentRepetitions;
  let intervalDays = currentIntervalDays;
  let easeFactorPct = currentEaseFactorPct;
  let lapses = currentLapses;

  const efBefore = easeFactorPct / 100;

  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      const gradeMultiplier =
        grade === "easy" ? 1.3 : grade === "hard" ? 1.2 : 1;
      intervalDays = Math.max(
        1,
        Math.round(intervalDays * efBefore * gradeMultiplier),
      );
    }

    repetitions += 1;
  }

  const efAfter =
    efBefore + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactorPct = Math.max(130, Math.round(efAfter * 100));

  const now = Date.now();
  const nextReviewAt = new Date(now + intervalDays * 24 * 60 * 60 * 1000);

  return {
    repetitions,
    intervalDays,
    easeFactorPct,
    lapses,
    nextReviewAt,
    lastReviewedAt: new Date(now),
  };
}

type ReviewCard = {
  textId: number;
  word: string;
  category: string;
  expectedMeaning: string;
  repetitions: number;
  intervalDays: number;
  easeFactorPct: number;
  lapses: number;
};

async function getNextVocabularyCard(
  idUser: number,
): Promise<ReviewCard | null> {
  const now = new Date();

  const [dueCard] = await db
    .select({
      textId: textTable.id,
      word: textTable.name,
      category: categoryTable.name,
      expectedMeaning: textTable.content,
      repetitions: vocabularyTable.repetitions,
      intervalDays: vocabularyTable.intervalDays,
      easeFactorPct: vocabularyTable.easeFactorPct,
      lapses: vocabularyTable.lapses,
    })
    .from(vocabularyTable)
    .innerJoin(textTable, eq(textTable.id, vocabularyTable.idText))
    .innerJoin(categoryTable, eq(categoryTable.id, textTable.idCategory))
    .where(
      and(
        eq(vocabularyTable.idUser, idUser),
        eq(vocabularyTable.active, true),
        eq(textTable.idUser, idUser),
        eq(textTable.active, true),
        eq(textTable.isReview, true),
        lte(vocabularyTable.nextReviewAt, now),
      ),
    )
    .orderBy(sql`random()`)
    .limit(1);

  if (dueCard) {
    return {
      ...dueCard,
      expectedMeaning: stripHtml(dueCard.expectedMeaning),
    };
  }

  const [newCard] = await db
    .select({
      textId: textTable.id,
      word: textTable.name,
      expectedMeaning: textTable.content,
      category: categoryTable.name,
    })
    .from(textTable)
    .innerJoin(categoryTable, eq(categoryTable.id, textTable.idCategory))
    .leftJoin(
      vocabularyTable,
      and(
        eq(vocabularyTable.idText, textTable.id),
        eq(vocabularyTable.idUser, idUser),
        eq(vocabularyTable.active, true),
      ),
    )
    .where(
      and(
        eq(textTable.idUser, idUser),
        eq(textTable.active, true),
        eq(textTable.isReview, true),
        isNull(vocabularyTable.id),
      ),
    )
    .orderBy(sql`random()`)
    .limit(1);

  if (!newCard) return null;

  return {
    textId: newCard.textId,
    word: newCard.word,
    expectedMeaning: stripHtml(newCard.expectedMeaning),
    category: newCard.category,
    repetitions: 0,
    intervalDays: 0,
    easeFactorPct: 250,
    lapses: 0,
  };
}

export const load = (async ({ locals }) => {
  const idUser = getUserId(locals.user?.id);
  const now = new Date();

  const [card, [{ dueProgressCount }], [{ unseenCount }], [{ totalCount }]] =
    await Promise.all([
      getNextVocabularyCard(idUser),
      db
        .select({ dueProgressCount: count(vocabularyTable.id) })
        .from(vocabularyTable)
        .innerJoin(textTable, eq(textTable.id, vocabularyTable.idText))
        .where(
          and(
            eq(vocabularyTable.idUser, idUser),
            eq(vocabularyTable.active, true),
            eq(textTable.idUser, idUser),
            eq(textTable.active, true),
            eq(textTable.isReview, true),
            lte(vocabularyTable.nextReviewAt, now),
          ),
        ),
      db
        .select({ unseenCount: count(textTable.id) })
        .from(textTable)
        .leftJoin(
          vocabularyTable,
          and(
            eq(vocabularyTable.idText, textTable.id),
            eq(vocabularyTable.idUser, idUser),
            eq(vocabularyTable.active, true),
          ),
        )
        .where(
          and(
            eq(textTable.idUser, idUser),
            eq(textTable.active, true),
            eq(textTable.isReview, true),
            isNull(vocabularyTable.id),
          ),
        ),
      db
        .select({ totalCount: count(textTable.id) })
        .from(textTable)
        .where(
          and(
            eq(textTable.idUser, idUser),
            eq(textTable.active, true),
            eq(textTable.isReview, true),
          ),
        ),
    ]);

  const dueCount = dueProgressCount + unseenCount;

  return {
    card,
    dueCount,
    totalCount,
  };
}) satisfies PageServerLoad;

export const actions = {
  review: async ({ request, locals }) => {
    const formData = await request.formData();
    const textIdRaw = formData.get("textId")?.toString() ?? "";
    const typedMeaning = formData.get("typedMeaning")?.toString().trim() ?? "";
    const gradeRaw = (formData.get("grade")?.toString() ?? "").toLowerCase();
    const idUser = getUserId(locals.user?.id);

    const textId = Number(textIdRaw);
    const validGrades: ReviewGrade[] = ["again", "hard", "good", "easy"];

    if (!Number.isInteger(textId) || textId <= 0) {
      return fail(422, {
        success: false,
        actionType: "review",
        error: "Card inválido para revisão",
      });
    }

    if (!typedMeaning || typedMeaning.length < 2) {
      return fail(422, {
        success: false,
        actionType: "review",
        error: "Digite o significado antes de classificar",
      });
    }

    if (!validGrades.includes(gradeRaw as ReviewGrade)) {
      return fail(422, {
        success: false,
        actionType: "review",
        error: "Classificação inválida",
      });
    }

    const [textCard] = await db
      .select()
      .from(textTable)
      .where(
        and(
          eq(textTable.id, textId),
          eq(textTable.idUser, idUser),
          eq(textTable.active, true),
          eq(textTable.isReview, true),
        ),
      )
      .limit(1);

    if (!textCard) {
      return fail(404, {
        success: false,
        actionType: "review",
        error: "Card não encontrado",
      });
    }

    const [progress] = await db
      .select()
      .from(vocabularyTable)
      .where(
        and(
          eq(vocabularyTable.idText, textId),
          eq(vocabularyTable.idUser, idUser),
          eq(vocabularyTable.active, true),
        ),
      )
      .limit(1);

    const expectedMeaning = stripHtml(textCard.content);
    const similarity = similarityPercent(typedMeaning, expectedMeaning);
    const autoCorrect = similarity >= 70;
    const updatedSchedule = applySm2(
      progress?.repetitions ?? 0,
      progress?.intervalDays ?? 0,
      progress?.easeFactorPct ?? 250,
      progress?.lapses ?? 0,
      gradeRaw as ReviewGrade,
    );

    await db
      .insert(vocabularyTable)
      .values({
        idText: textId,
        idUser,
        repetitions: updatedSchedule.repetitions,
        intervalDays: updatedSchedule.intervalDays,
        easeFactorPct: updatedSchedule.easeFactorPct,
        lapses: updatedSchedule.lapses,
        lastReviewedAt: updatedSchedule.lastReviewedAt,
        nextReviewAt: updatedSchedule.nextReviewAt,
        active: true,
        createdAt: progress?.createdAt ?? new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [vocabularyTable.idText, vocabularyTable.idUser],
        set: {
          repetitions: updatedSchedule.repetitions,
          intervalDays: updatedSchedule.intervalDays,
          easeFactorPct: updatedSchedule.easeFactorPct,
          lapses: updatedSchedule.lapses,
          lastReviewedAt: updatedSchedule.lastReviewedAt,
          nextReviewAt: updatedSchedule.nextReviewAt,
          active: true,
          updatedAt: new Date(),
        },
      });

    return {
      success: true,
      actionType: "review",
      similarity,
      autoCorrect,
      expectedMeaning,
      message: "Revisão registrada",
    };
  },
} satisfies Actions;
