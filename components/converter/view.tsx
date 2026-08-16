'use client'

import { Button } from '@/components/ui/button'
import { Currency } from '@/types'

import SwitchButton from './switch'
import CurrencyCard from './card'

import { useConverter, findCurrency } from '@/hooks/useConverter'

import { cn } from '@/lib/utils'

const DEFAULT_BASE_CURRENCY: Currency = {
  code: 'USD',
  name: 'US Dollar',
  flag: '🇺🇸️',
}
const DEFAULT_QUOTE_CURRENCY: Currency = {
  code: 'COP',
  name: 'Colombian Peso',
  flag: '🇨🇴️',
}

export default function View({ currencies }: { currencies: Currency[] }) {
  const {
    base,
    quote,
    baseInput,
    quoteInput,
    rate,
    isLoadingRate,
    handleAmountChange,
    switchCurrencies,
  } = useConverter()

  const baseData = findCurrency(currencies, base) ?? DEFAULT_BASE_CURRENCY
  const quoteData = findCurrency(currencies, quote) ?? DEFAULT_QUOTE_CURRENCY

  return (
    <section className="w-full md:pt-12 lg:pb-8 pt-8 pb-10">
      <h2 className="uppercase text-xl mb-4">Check the rate</h2>

      <div className="bg-neutral-700 p-4 sm:p-5 rounded-2xl space-y-8 max-w-full">
        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-4 items-center">
          {/* currency 'base' */}
          <CurrencyCard
            label="send"
            name="base"
            value={baseInput}
            currency={baseData}
            currencies={currencies}
            onChange={(event) => handleAmountChange('base', event.target.value)}
          />

          <SwitchButton onSwitch={switchCurrencies} />

          {/* currency 'quote' */}
          <CurrencyCard
            label="receive"
            name="quote"
            value={quoteInput}
            currency={quoteData}
            currencies={currencies}
            onChange={(event) =>
              handleAmountChange('quote', event.target.value)
            }
            className="text-lime-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-y-4 justify-between items-center">
          <p
            className={cn(
              'text-xs transition-all duration-300 tabular-nums',
              isLoadingRate
                ? 'opacity-40 blur-sm select-none'
                : 'opacity-100 blur-0',
            )}
          >
            1 {baseData.code} = {rate} {quoteData.code}
          </p>
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
