import { Currency, Rate } from '@/types'
import { getFlagByISOCode } from '../currency/flags'
import { MONTH_AGO } from '../days'

import { formatAmount } from '../formatting'

const API_BASE = 'https://api.frankfurter.dev/v2'

export const getCurrencies = async () => {
  try {
    const response = await fetch(`${API_BASE}/currencies`, {
      next: { revalidate: 86400 }, // 24 hrs
    })

    if (!response.ok) return []

    interface FrankFurterCurrency {
      iso_code: string
      iso_numeric: string
      name: string
      symbol: string
      start_date: string
      end_date: string
    }

    const data: FrankFurterCurrency[] = await response.json()

    const currencies: Currency[] = data.map((c) => ({
      code: c.iso_code,
      name: c.name,
      startDate: c.start_date,
      endDate: c.end_date,
      flag: getFlagByISOCode(c.iso_code),
    }))

    return currencies
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return []
  }
}

export const getRate = async (
  base: string,
  quote: string,
  signal?: AbortSignal,
) => {
  if (base === quote) {
    return 1
  }

  const response = await fetch(`${API_BASE}/rate/${base}/${quote}`, { signal })

  if (!response.ok) throw new Error('unable to fetch exchange rate')

  const data: Rate = await response.json()

  return data.rate
}

export interface Result {
  name: string
  code: string
  flag: string
  rate: number
  amount: string
}

export const getRates = async (
  base: string,
  quotes: string,
  amount = 1,
): Promise<Result[]> => {
  const url = `${API_BASE}/rates?base=${base}&quotes=${quotes}` // quotes=COP,USD,ALL,EUR

  const [response, currencies] = await Promise.all([
    fetch(url, {
      next: { revalidate: 3600 }, // 1hr
    }),
    getCurrencies(),
  ])

  if (!response.ok) throw new Error('unable to fetch exchange rate')

  const rates: Rate[] = await response.json()

  const map = new Map(currencies.map((c) => [c.code, c]))

  const result: Result[] = []

  for (const r of rates) {
    const found = map.get(r.quote)

    if (!found) continue

    result.push({
      name: found.name,
      code: found.code,
      flag: found.flag,
      rate: r.rate,
      amount: formatAmount(r.rate * amount),
    })
  }

  // exclude base
  return result.filter((r) => r.code !== base)
}

export const getHistory = async (
  from = MONTH_AGO,
  base = 'USD',
  quote = 'EUR',
) => {
  try {
    const response = await fetch(
      `${API_BASE}/rates?from=${from}&base=${base}&quotes=${quote}`,
      {
        next: { revalidate: 3600 }, // 1hr
      },
    )

    if (!response.ok) return []

    const data: Rate[] = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching history rates:', error)
    return []
  }
}
