import { From } from '@/types'
import { formatShortDate } from './formatting'

const DAY_IN_MS = 24 * 60 * 60 * 1000

const daysMap: Record<From, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  '5Y': 1825,
} as const

export const getDate = (from: From) => {
  const days = daysMap[from] ?? 30

  const date = new Date(Date.now() - days * DAY_IN_MS)

  return formatShortDate(date)
}

export const SHORT_DATE_VALUES: From[] = [
  '1D',
  '1W',
  '1M',
  '3M',
  '1Y',
  '5Y',
] as const

export const MONTH_AGO = getDate('1M')
