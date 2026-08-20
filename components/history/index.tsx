import { Suspense } from 'react'
import View from './view'
import { From, SearchParams } from '@/types'

import { getHistory } from '@/lib/api/frankfurter'
import { getDate } from '@/lib/days'

interface Props {
  searchParams: Promise<SearchParams>
}

async function Async({ searchParams }: Props) {
  const resolvedParams = await searchParams

  const { base, quote, from } = resolvedParams

  const fromDate = getDate(from as From) ?? '1M'

  const data = await getHistory(fromDate, base, quote)

  return <View data={data} />
}

function Skeleton() {
  return (
    <section className="animate-pulse">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start mb-5 gap-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-4 w-full">
          <div className="h-20 bg-neutral-800 rounded-xl" />
          <div className="h-20 bg-neutral-800 rounded-xl" />
          <div className="h-20 bg-neutral-800 rounded-xl" />
          <div className="h-20 bg-neutral-800 rounded-xl" />
        </div>
      </div>
      <div className="p-5 bg-neutral-800 border border-neutral-700 rounded-2xl h-80" />
    </section>
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
