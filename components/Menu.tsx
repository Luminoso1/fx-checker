import Link from 'next/link'
import { From, SearchParamsPage } from '@/types'
import { cn } from '@/lib/utils'

const links: From[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

const DAY_IN_MS = 24 * 60 * 60 * 1000
const formatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const daysMap: Record<From, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '1Y': 365,
  '5Y': 1825,
}

export const getDate = (from: From) => {
  const days = daysMap[from] ?? 30

  const date = new Date(Date.now() - days * DAY_IN_MS)

  return formatter.format(date)
}

function Menu({ searchParams }: { searchParams: SearchParamsPage }) {
  const currentFrom = searchParams.from ?? '1M'

  const createQueryString = (key: string, value: string) => {
    const params = new URLSearchParams()

    Object.entries(searchParams).forEach(([k, v]) => {
      if (typeof v === 'string') {
        params.set(k, v)
      } else if (Array.isArray(v) && v[0]) {
        params.set(k, v[0])
      }
    })

    params.set(key, value)

    return params.toString()
  }

  return (
    <menu className="bg-neutral-700 border border-neutral-700 rounded-lg flex">
      {links.map((value) => {
        const isActive = currentFrom === value
        return (
          <li key={value}>
            <Link
              href={`?${createQueryString('from', value)}`}
              className={cn(
                'block px-4 py-3 text-xs transition-colors rounded-lg',
                isActive
                  ? 'bg-neutral-500 text-neutral-50'
                  : 'text-neutral-200',
              )}
            >
              {value}
            </Link>
          </li>
        )
      })}
    </menu>
  )
}

export default Menu
