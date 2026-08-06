'use client'
import { Currency } from '@/types'
import SwitchButton from '@/components/SwitchButton'
import { Button } from '@/components/ui/button'
import CurrencyCard from '@/components/CurrencyCard'

import { useCurrencyState } from '@/hooks/useCurrencyState'

export default function Converter({ currencies }: { currencies: Currency[] }) {
  const {
    baseData,
    quoteData,
    baseValue,
    quoteValue,
    rate,
    onChange,
    onSwitch,
  } = useCurrencyState(currencies)
  return (
    <section className="w-full md:pt-12 lg:pb-8 pt-8 pb-10">
      <h2 className="uppercase text-xl mb-4">Check the rate</h2>

      <div className="bg-neutral-700 p-4 sm:p-5 rounded-2xl space-y-8 max-w-full">
        <div className="flex flex-col sm:flex-row gap-x-6 gap-y-4 items-center">
          {/* currency 'base' */}
          <CurrencyCard
            label="send"
            name="base"
            value={baseValue}
            currency={baseData}
            currencies={currencies}
            onChange={onChange}
          />

          <SwitchButton onSwitch={onSwitch} />

          {/* currency 'quote' */}
          <CurrencyCard
            label="receive"
            name="quote"
            value={quoteValue}
            currency={quoteData}
            currencies={currencies}
            onChange={onChange}
            className="text-lime-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-y-4 justify-between items-center">
          <div>
            <p className="text-xs">
              1 {baseData.code} = {rate} {quoteData.code}
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
