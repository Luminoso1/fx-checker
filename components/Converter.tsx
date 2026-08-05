'use client'
import { useState, useEffect, useCallback } from 'react'

import { Currency } from '@/types'
import SwitchButton from '@/components/SwitchButton'
import Select from '@/components/Select'
import { Button } from '@/components/ui/button'

import { getRate } from '@/lib/fn'
import { formatLocaleAmount } from '@/lib/utils'

import { useSearch } from '@/hooks/useSearch'

interface State {
  base: Currency & { value: string }
  quote: Currency & { value: string }
  rate: string
}

export default function Converter({ currencies }: { currencies: Currency[] }) {
  const { base, quote, amount, setParam, switchCodes } = useSearch()

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

  const [state, setState] = useState<State>(() => {
    const baseData = findCurrency(base, 'US Dollar', '🇺🇸️')
    const quoteData = findCurrency(quote, 'Euro', '🇪🇺️')
    return {
      base: {
        ...baseData,
        value: amount,
      },
      quote: {
        ...quoteData,
        value: '0.853',
      },
      rate: '0.853',
    }
  })

  const onChangeValue: React.ChangeEventHandler<
    HTMLInputElement,
    HTMLInputElement
  > = (event) => {
    const { name, value } = event.target

    const sanitizedVal = value.replace(/[-+e]/gi, '')
    const sanitizedNum = Number(sanitizedVal)

    if (isNaN(sanitizedNum)) return

    const rateNum = Number(state.rate)
    const converted =
      name === 'base' ? sanitizedNum * rateNum : sanitizedNum / rateNum

    setState((prev) => {
      if (name === 'base') {
        return {
          ...prev,
          base: { ...prev.base, value: sanitizedVal },
          quote: { ...prev.quote, value: formatLocaleAmount(converted) },
        }
      } else {
        return {
          ...prev,
          base: { ...prev.base, value: formatLocaleAmount(converted) },
          quote: { ...prev.quote, value: sanitizedVal },
        }
      }
    })

    const newAmountValue = name === 'base' ? sanitizedNum : converted

    setParam('amount', newAmountValue.toFixed(2))
  }

  const handleSwitch = () => {
    const currentBase = state.base
    const currentQuote = state.quote
    setState((prev) => ({
      ...prev,
      base: { ...currentQuote, value: prev.base.value },
      quote: { ...currentBase, value: prev.quote.value },
    }))

    switchCodes()
  }

  useEffect(() => {
    const fetchRate = async () => {
      const rate = await getRate(base, quote)

      const baseData = findCurrency(base, 'US Dollar', '🇺🇸️')
      const quoteData = findCurrency(quote, 'Euro', '🇪🇺️')

      setState((prev) => {
        const currentBaseAmount = Number(prev.base.value) || Number(amount)
        const convertedQuoteAmount = (currentBaseAmount * rate).toFixed(2)
        return {
          base: { ...baseData, value: currentBaseAmount.toString() },
          quote: {
            ...quoteData,
            value: convertedQuoteAmount,
          },
          rate: rate.toString(),
        }
      })
    }

    fetchRate()
  }, [base, quote])

  return (
    <section className="w-full md:pt-12 lg:pb-8 pt-8 pb-10">
      <h2 className="uppercase text-xl mb-4">Check the rate</h2>

      <div className="bg-neutral-700 p-4 sm:p-5 rounded-2xl space-y-8 max-w-full">
        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-4 items-center">
          {/* currency 'base' */}
          <div className="flex-1 bg-neutral-600 border border-neutral-500 p-4 sm:p-5 rounded-2xl">
            <label
              className="uppercase text-sm text-neutral-100 mb-2"
              htmlFor="base"
            >
              Send
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                name="base"
                id="base"
                aria-label={`Amount to send in ${state.base.name}`}
                inputMode="decimal"
                value={state.base.value ?? '0'}
                onChange={onChangeValue}
                className="outlined rounded-lg flex-1 shrink-0 font-bold w-full hover:underline underline-offset-4 text-[32px] md:text-[40px]"
              />
              <Select
                param="base"
                current={state.base}
                initialCurrencies={currencies}
              />
            </div>
          </div>

          <SwitchButton onSwitch={handleSwitch} />

          {/* currency 'quote' */}
          <div className="flex-1 bg-neutral-600 border border-neutral-500 p-4 sm:p-5 rounded-2xl">
            <label
              className="uppercase text-sm text-neutral-100 mb-2"
              htmlFor="quote"
            >
              Receive
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                name="quote"
                id="quote"
                aria-label={`Amount to receive in ${state.quote.name}`}
                value={state.quote.value ?? '0'}
                onChange={onChangeValue}
                className="outlined rounded-lg text-lime-500 flex-1 shrink-0 font-bold w-full hover:underline underline-offset-4 text-[32px] md:text-[40px]"
              />
              <Select
                param="quote"
                current={state.quote}
                initialCurrencies={currencies}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-y-4 justify-between items-center">
          <div>
            <p className="text-xs">
              1 {base} = {state.rate} {quote}
            </p>
          </div>
          <div className="space-x-3">
            <Button className="bg-lime-500 px-3 py-2 uppercase text-black font-medium text-xs">
              Favorited
            </Button>
            <Button className="border border-lime-500 px-3 py-2 uppercase text-neutral-50 font-medium text-xs">
              Log Conversion
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
