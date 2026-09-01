import { useState, useMemo } from 'react'
import { Currency } from '@/types'

export const useCurrencies = (initial: Currency[]) => {
  const [currencies] = useState<Currency[]>(initial || [])
  const [query, setQuery] = useState('')

  const filteredCurrencies = useMemo(() => {
    if (!query.trim()) return currencies

    const normalized = query.toLowerCase().trim()

    return currencies.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(normalized)
      const codeMatch = c.code.toLowerCase().includes(normalized)

      return nameMatch || codeMatch
    })
  }, [currencies, query])

  return { currencies: filteredCurrencies, query, setQuery }
}
