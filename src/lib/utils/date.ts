import { redirect } from '@sveltejs/kit'
import { and, gte, lte } from 'drizzle-orm'
import type { SQLiteColumn } from 'drizzle-orm/sqlite-core'

export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }

  if (typeof date === 'string') {
    const [year, month, day] = date.split('-').map(Number)
    date = new Date(year, month - 1, day)
  }

  return new Intl.DateTimeFormat(
    'pt-BR',
    options ? options : defaultOptions,
  ).format(date)

}
  
function parseDate(dateStr: string): Date {
  if (!isNaN(Number(dateStr))) {
    return new Date(Number(dateStr))
  }

  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export const getDateRangeCondition = (
  startDate: string | null,
  endDate: string | null,
  column: SQLiteColumn,
) => {
  if (startDate && endDate) {
    const start = parseDate(startDate)
    start.setHours(0, 0, 0, 0)
    const end = parseDate(endDate)
    end.setHours(23, 59, 59, 999)

    return and(gte(column, start), lte(column, end))
  }
  return undefined
}