import { Suspense } from 'react'
import View from './view'

import { SearchParams } from '@/types'

import { getCurrencies, getRates } from '@/lib/api/frankfurter'

interface Props {
  searchParams: Promise<SearchParams>
}

function Skeleton() {
  return (
    <section className="p-5 space-y-5 animate-pulse rounded-2xl bg-neutral-700 border border-neutral-600">
      <div className="flex items-center justify-between">
        <div className="h-6 w-73 bg-neutral-600 rounded-sm border border-neutral-500" />
        <div className="h-6 w-20 bg-neutral-600 rounded-sm border border-neutral-500"></div>
      </div>

      <div className="space-y-3">
        <div className="h-18.5 bg-neutral-600 rounded-xl border border-neutral-500" />
        <div className="h-18.5 bg-neutral-600 rounded-xl border border-neutral-500" />
        <div className="h-18.5 bg-neutral-600 rounded-xl border border-neutral-500" />
        <div className="h-18.5 bg-neutral-600 rounded-xl border border-neutral-500" />
        <div className="h-18.5 bg-neutral-600 rounded-xl border border-neutral-500" />
      </div>
    </section>
  )
}

async function Async({ searchParams }: Props) {
  const resolvedParams = await searchParams

  const base = resolvedParams.base || 'USD'
  const quotes = resolvedParams.quotes || 'COP,EUR'
  const amount = Number(resolvedParams.amount) || 1

  const [rates, currencies] = await Promise.all([
    getRates(base, quotes, amount),
    getCurrencies(),
  ])

  return (
    <View
      base={base}
      amount={amount}
      rates={rates}
      currencies={currencies}
      quotes={quotes}
    />
  )
}

function Wrapper({ searchParams }: Props) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Async searchParams={searchParams} />
    </Suspense>
  )
}

export default Wrapper
