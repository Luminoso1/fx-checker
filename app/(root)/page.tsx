import History from '@/components/history'
import { SearchParams } from '@/types'

interface Props {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: Props) {
  return <History searchParams={searchParams} />
}
