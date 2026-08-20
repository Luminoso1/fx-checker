'use client'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { Currency } from '@/types'
import { Result } from '@/lib/api/frankfurter'

import { useCurrencyQuery } from '@/hooks/useCurrencyQuery'

import { formatAmount } from '@/lib/formatting'
import { cn } from '@/lib/utils'

interface Props {
  base: string
  amount: number
  rates: Result[]
  currencies: Currency[]
  quotes: string
}

function Compare({ base, amount, rates, currencies, quotes }: Props) {
  const { setQuotes } = useCurrencyQuery()

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const formattedAmount = formatAmount(amount)
  const pairsLength = rates.length

  return (
    <div className="relative bg-neutral-700 border border-neutral-600 rounded-2xl p-5 h-130">
      {isOpen && (
        <div className="absolute inset-0 p-5 rounded-2xl z-10 bg-neutral-700">
          <header className="text-right mb-4">
            <Button
              onClick={() => setIsOpen(false)}
              className="py-2 px-3 text-xs rounded-sm border border-neutral-500 hover:bg-neutral-500 transition duration-300"
            >
              x
            </Button>
          </header>
          <ol
            className="grid grid-cols-4 gap-4 overflow-y-auto h-105 p-1"
            tabIndex={-1}
          >
            {currencies.map(({ code, name, flag }) => {
              const isActive = quotes.includes(code)
              return (
                <li key={code}>
                  <Button
                    onClick={() => setQuotes(code)}
                    className={cn(
                      'w-full h-full min-w-0 bg-neutral-500 text-left',
                      'rounded-lg p-2 border-2',
                      'flex items-center gap-2',
                      isActive ? 'border-lime-500' : 'border-neutral-400',
                    )}
                  >
                    <span className="shrink-0 text-sm">{flag}</span>
                    <span className="min-w-0 truncate text-sm">{name}</span>
                  </Button>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-5">
          <p className="text-neutral-200 uppercase tracking-[1px] text-sm">
            MULTI-CURRENCY
          </p>
          <p className="uppercase tracking-[1px] text-base">
            {formattedAmount} from {base}
          </p>
        </div>

        <div className="flex items-center justifu-between gap-2">
          <p className="text-neutral-200 text-sm uppercase tracking-[1px]">
            {pairsLength} pairs
          </p>
          <Button
            onClick={() => setIsOpen(true)}
            className="py-2 px-3 text-xs rounded-sm border border-neutral-500 hover:bg-neutral-500 transition duration-300"
          >
            x
          </Button>
        </div>
      </div>

      <ol className="space-y-3 h-105 overflow-y-auto">
        {rates.map(({ code, name, flag, rate, amount }) => (
          <li
            key={code}
            className="bg-neutral-600 border border-neutral-500 rounded-xl flex items-center justify-between py-3 px-4"
          >
            <div className="flex items-center gap-5">
              <span className="text-xl">{flag}</span>
              <div>
                <span className="block text-sm">{code}</span>
                <p className="text-xs text-neutral-200">{name}</p>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="text-right">
                <span className="block">{amount}</span>
                <span className="inline text-xs text-neutral-200">
                  @ {rate}
                </span>
              </div>
              <Button className="border border-neutral-300 size-10 grid place-content-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 13 12"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.59811 0.413133C5.87936 -0.149367 6.67623 -0.12593 6.93404 0.413133L8.48092 3.53032L11.9028 4.02251C12.5122 4.11626 12.7465 4.86626 12.3012 5.31157L9.84029 7.72563L10.4262 11.1241C10.52 11.7334 9.86373 12.2022 9.32467 11.9209L6.27779 10.3038L3.20748 11.9209C2.66842 12.2022 2.01217 11.7334 2.10592 11.1241L2.69186 7.72563L0.230918 5.31157C-0.214394 4.86626 0.0199805 4.11626 0.629356 4.02251L4.07467 3.53032L5.59811 0.413133Z"
                    fill="none"
                    stroke="currentColor"
                  />
                </svg>
              </Button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Compare
