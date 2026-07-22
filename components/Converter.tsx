'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { Currency } from '@/types'
import SwitchButton from '@/components/SwitchButton'
import Select from '@/components/Select'

import { getRate } from '@/lib/fn'
import { formatLocaleAmount } from '@/lib/utils'

interface State {
  base: Currency & { value: string }
  quote: Currency & { value: string }
  rate: string
}

export default function Converter({ currencies }: { currencies: Currency[] }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const base = searchParams.get('base') ?? 'USD'
  const quote = searchParams.get('quote') ?? 'EUR'
  const amount = searchParams.get('amount') ?? '1'

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

  const onChangeValue = (key: 'base' | 'quote', value: string) => {
    const sanitizedVal = value.replace(/[-+e]/gi, '')
    const sanitizedNum = Number(sanitizedVal)

    if (isNaN(sanitizedNum)) return

    const rateNum = Number(state.rate)
    const converted =
      key === 'base' ? sanitizedNum * rateNum : sanitizedNum / rateNum

    setState((prev) => {
      if (key === 'base') {
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

    const params = new URLSearchParams(searchParams.toString())
    params.set(
      'amount',
      key === 'base' ? sanitizedNum.toFixed(2) : converted.toFixed(2),
    )
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleSwitch = () => {
    const currentBase = state.base
    const currentQuote = state.quote
    setState((prev) => ({
      ...prev,
      base: { ...currentQuote, value: prev.base.value },
      quote: { ...currentBase, value: prev.quote.value },
    }))

    const params = new URLSearchParams(searchParams.toString())
    params.set('base', currentQuote.code)
    params.set('quote', currentBase.code)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
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
    <section className="py-12 ">
      <h2 className="uppercase text-xl mb-4">Check the rate</h2>

      <div className="bg-neutral-700 p-5 rounded-2xl space-y-8">
        <div className="flex gap-6 items-center">
          {/* currency 'base' */}
          <Rate title="send">
            <div className="flex gap-2">
              <div className="flex-1 inline-grid grid-cols-1 items-center text-4xl max-w-full overflow-hidden">
                <span className="col-start-1 row-start-1 invisible whitespace-pre px-1">
                  {state.base.value}
                </span>

                <input
                  type="text"
                  value={state.base.value}
                  onChange={(event) =>
                    onChangeValue('base', event.target.value)
                  }
                  className="font-bold col-start-1 row-start-1 w-full bg-transparent px-1 outline-none hover:underline underline-offset-4"
                />
              </div>
              <Select
                param="base"
                current={state.base}
                initialCurrencies={currencies}
              />
            </div>
          </Rate>

          <SwitchButton onSwitch={handleSwitch} />

          {/* currency 'quote' */}
          <Rate title="receive">
            <div className="flex gap-2">
              <div className="flex-1 inline-grid grid-cols-1 items-center text-4xl max-w-full overflow-hidden">
                <span className="col-start-1 row-start-1 invisible whitespace-pre px-1">
                  {state.quote.value}
                </span>

                <input
                  type="text"
                  value={state.quote.value}
                  onChange={(event) =>
                    onChangeValue('quote', event.target.value)
                  }
                  className="text-lime-500 font-bold col-start-1 row-start-1 w-full bg-transparent px-1 outline-none hover:underline underline-offset-4"
                />
              </div>
              <Select
                param="quote"
                current={state.quote}
                initialCurrencies={currencies}
              />
            </div>
          </Rate>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs">
              1 {base} = {state.rate} {quote}
            </p>
          </div>
          <div className="space-x-3">
            <button className="cursor-pointer bg-lime-500 px-3 py-2 uppercase text-black rounded-lg font-medium text-xs">
              Favorited
            </button>
            <button className="cursor-pointer border border-lime-500 px-3 py-2 uppercase text-neutral-50 rounded-lg font-medium text-xs">
              Log Conversion
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const Rate = (props: { title: string; children: React.ReactNode }) => {
  return (
    <div className="flex-1 bg-neutral-600 border border-neutral-500 p-5 rounded-2xl">
      <h3 className="uppercase text-sm text-neutral-100 mb-2">{props.title}</h3>
      {props.children}
    </div>
  )
}
