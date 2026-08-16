import { Suspense } from 'react'
import View from './view'
import { getCurrencies } from '@/lib/api/frankfurter'

async function Async() {
  const currencies = await getCurrencies()
  return <View currencies={currencies} />
}

function Skeleton() {
  return (
    <section className="w-full md:pt-12 lg:pb-8 pt-8 pb-10 animate-pulse">
      <div className="h-6 w-36 bg-neutral-800 rounded mb-4" />
      <div className="bg-neutral-800 p-4 sm:p-5 h-64 rounded-2xl" />
    </section>
  )
}

async function Wrapper() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Async />
    </Suspense>
  )
}

export default Wrapper
