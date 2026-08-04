import { Currency, Rate } from '@/types'

const API_BASE = 'https://api.frankfurter.dev/v2'

const SPECIAL_CURRENCY_FLAGS: Record<string, string> = {
  EUR: 'eu',
  USD: 'us',
  GBP: 'gb',
  AUD: 'au',
  CAD: 'ca',
  CHF: 'ch',
  JPY: 'jp',
  ZAR: 'za',
  ANG: 'an',
  XOF: 'sn',
  XAF: 'cm',
  XPF: 'pf',
  XCD: 'lc',
  XCG: 'cw',
  XDR: 'un',
  XEU: 'eu',
  XAG: 'un',
  XAU: 'un',
}

const generateFlag = (code: string) => {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

const getFlagByISOCode = (isoCode: string) => {
  let code = SPECIAL_CURRENCY_FLAGS[isoCode]
  if (code) {
    return generateFlag(code)
  }

  code = isoCode.slice(0, 2)
  return generateFlag(code)
}

export const getRate = async (base: string, quote: string) => {
  return fetch(`${API_BASE}/rate/${base}/${quote}`)
    .then((r) => r.json())
    .then((d) => d.rate as number)
}

export const getRates = async (base: string) => {
  try {
    const response = await fetch(`${API_BASE}/rates?base=${base}`, {
      next: { revalidate: 86400 },
    })

    if (!response.ok) return []

    interface FrankFurterRate {
      date: string
      base: string
      quote: string
      rate: number
    }

    const data: FrankFurterRate[] = await response.json()

    const rates: Rate[] = data.map((r) => ({
      ...r,
    }))
  } catch (error) {
    console.error('Error fetching rates:', error)
    return []
  }
}

export const getCurrencies = async () => {
  try {
    const response = await fetch(`${API_BASE}/currencies`, {
      next: { revalidate: 86400 },
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
    console.error('Error fetching rate:', error)
    return []
  }
}

export const getHistory = async (from: string, base: string, quote: string) => {
  try {
    const response = await fetch(
      `${API_BASE}/rates?from=${from}&base=${base}&quotes=${quote}`,
    )

    if (!response.ok) return []

    const data: Rate[] = await response.json()

    return data
  } catch (error) {
    console.error('Error fetching history rates:', error)
    return []
  }
}
