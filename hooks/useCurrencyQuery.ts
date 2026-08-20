import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { Field } from '@/types'

const DEFAULTS = {
  base: 'USD',
  quote: 'COP',
  amount: '1',
  from: '1M',
  quotes: 'COP,EUR',
} as const

export function useCurrencyQuery() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const base = searchParams.get('base') ?? DEFAULTS.base
  const quote = searchParams.get('quote') ?? DEFAULTS.quote
  const amount = searchParams.get('amount') || DEFAULTS.amount
  const from = searchParams.get('from') ?? DEFAULTS.from

  const quotes = searchParams.get('quotes') ?? DEFAULTS.quotes

  const quotesArray = quotes
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean)

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    }

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.replace(url, { scroll: false })
  }

  function setAmount(amount: string) {
    updateParams({ amount })
  }

  function setCurrency(field: Field, code: string) {
    updateParams({ [field]: code })
  }

  function setFrom(from: string) {
    updateParams({ from })
  }

  function setQuotes(code: string) {
    const normalizedQuote = code.trim().toUpperCase()

    const nextQuotes = new Set(quotesArray)
    if (nextQuotes.has(code)) {
      nextQuotes.delete(code)
    } else {
      nextQuotes.add(normalizedQuote)
    }

    updateParams({ quotes: Array.from(nextQuotes).join(',') })
  }

  const swap = () => {
    updateParams({ base: quote, quote: base })
  }

  return {
    base,
    quote,
    from,
    amount,
    quotes,
    setAmount,
    setCurrency,
    setFrom,
    setQuotes,
    swap,
  }
}
