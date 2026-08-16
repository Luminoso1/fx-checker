import { Suspense } from 'react'
import History, { type SearchParams } from '@/components/history'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  return (
    <Suspense>
      <History searchParams={searchParams} />
    </Suspense>
  )
}
