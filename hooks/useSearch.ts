import { useSearchParams, usePathname, useRouter } from 'next/navigation'

export const useSearch = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const base = searchParams.get('base') ?? 'USD'
  const quote = searchParams.get('quote') ?? 'EUR'
  const from = searchParams.get('from') ?? '1M'
  const amount = searchParams.get('amount') ?? '1'

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set(key, value)

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  const getQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    return params.toString()
  }

  const switchCodes = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('base', quote)
    params.set('quote', base)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return { base, quote, from, amount, setParam, getQuery, switchCodes }
}
