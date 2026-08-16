import { useEffect, useState } from 'react'

import { useCurrencyQuery } from './useCurrencyQuery'
import { useExchangeRate } from './useExchangeRate'

import {
  calculateBase,
  calculateQuote,
  parseAmount,
} from '@/lib/currency/amount'

import { formatAmount } from '@/lib/formatting'

import { Currency, Field } from '@/types'

export function findCurrency(currencies: Currency[], code: string) {
  return currencies.find((c) => c.code === code)
}

export function useConverter() {
  const { from, base, quote, amount, setAmount, setCurrency, swap } =
    useCurrencyQuery()
  const {
    rate,
    isLoading: isLoadingRate,
    error: rateError,
  } = useExchangeRate(base, quote)

  const [baseInput, setBaseInput] = useState(amount)
  const [quoteInput, setQuoteInput] = useState('')

  /*
   * Whenever the rate changes, recalculate the
   * opposite value from base amount
   */
  useEffect(() => {
    if (!rate) {
      return
    }

    const baseAmount = parseAmount(amount)

    if (baseAmount === null) {
      return
    }

    const quoteAmount = calculateQuote(baseAmount, rate)
    const formatted = formatAmount(quoteAmount)
    setQuoteInput(formatted)
  }, [rate])

  const handleAmountChange = (field: Field, value: string) => {
    if (rate === null) {
      return
    }

    if (field === 'base') {
      setBaseInput(value)

      const baseAmount = parseAmount(value)

      if (baseAmount === null) {
        setQuoteInput('')
        setAmount('')
        return
      }

      const quoteAmount = calculateQuote(baseAmount, rate)
      const formatted = formatAmount(quoteAmount)

      setQuoteInput(formatted)
      setAmount(value)

      return
    }
    {
      setQuoteInput(value)

      const quoteAmount = parseAmount(value)

      if (quoteAmount === null) {
        setBaseInput('')
        setAmount('')
        return
      }

      const baseAmount = calculateBase(quoteAmount, rate)
      const formatted = formatAmount(baseAmount)

      setBaseInput(formatted)
      setAmount(baseAmount.toFixed(2))
    }
  }

  return {
    base,
    quote,
    from,

    baseInput,
    quoteInput,

    rate,
    isLoadingRate,
    rateError,

    handleAmountChange,
    setCurrency,
    switchCurrencies: swap,
  }
}
