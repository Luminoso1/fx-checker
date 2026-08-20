import Compare from '@/components/compare'

import { SearchParams } from '@/types'

interface Props {
  searchParams: Promise<SearchParams>
}

export default function Page({ searchParams }: Props) {
  return <Compare searchParams={searchParams} />
}
