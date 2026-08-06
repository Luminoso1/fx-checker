import { useState, useEffect, useCallback } from 'react'
import { Currency } from '@/types'

import { getRate } from '@/lib/fn'
import { formatLocaleAmount } from '@/lib/utils'

import { useSearch } from '@/hooks/useSearch'

export const useCurrencyState = (currencies: Currency[]) => {
  const { base, quote, amount, setParam, switchCodes } = useSearch()

  const [rate, setRate] = useState<string>('1')
  const [baseValue, setBaseValue] = useState<string>(amount)
  const [quoteValue, setQuoteValue] = useState<string>('0')

  const findCurrency = useCallback(
    (code: string, fallbackName: string, fallbackFlag: string) => {
      const found = currencies.find((c) => c.code === code)
      return (
        found ?? {
          code,
          name: fallbackName,
          startDate: '',
          endDate: '',
          flag: fallbackFlag,
        }
      )
    },
    [],
  )

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    const sanitizedVal = value.replace(/[-+e]/gi, '')
    const sanitizedNum = Number(sanitizedVal)

    if (isNaN(sanitizedNum)) return

    const rateNum = Number(rate)
    if (name === 'base') {
      setBaseValue(sanitizedVal)
      setQuoteValue(formatLocaleAmount(sanitizedNum * rateNum))
      setParam('amount', sanitizedNum.toFixed(2))
    } else {
      setQuoteValue(sanitizedVal)
      setBaseValue(formatLocaleAmount(sanitizedNum / rateNum))
      setParam('amount', (sanitizedNum / rateNum).toFixed(2))
    }
  }

  // fetch rate when currecy change
  useEffect(() => {
    let isMounted = true
    const fetchRate = async () => {
      const result = await getRate(base, quote)

      if (!isMounted) return

      const rateNum = Number(result)
      const currentBase = Number(baseValue) || Number(amount)
      const converted = (currentBase * rateNum).toFixed(2)

      setRate(result.toString())
      setQuoteValue(converted)
    }

    fetchRate()
    return () => {
      isMounted = false
    }
  }, [base, quote])

  return {
    baseData: findCurrency(base, 'US Dollar', '🇺🇸️'),
    quoteData: findCurrency(quote, 'Euro', '🇪🇺️'),
    baseValue,
    quoteValue,
    rate,
    onChange,
    onSwitch: switchCodes,
  }
}
