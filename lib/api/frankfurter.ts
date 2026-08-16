import { Currency, Rate } from '@/types'
import { getFlagByISOCode } from '../currency/flags'
import { MONTH_AGO } from '../days'

const API_BASE = 'https://api.frankfurter.dev/v2'

export const getCurrencies = async () => {
  try {
    const response = await fetch(`${API_BASE}/currencies`, {
      next: { revalidate: 86400000 },
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

  const data: { rate: number } = await response.json()

  return data.rate
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
        next: { revalidate: 3600000 },
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
