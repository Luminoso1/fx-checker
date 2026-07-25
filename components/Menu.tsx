import Link from 'next/link'
import { From, SearchParamsPage } from '@/types'
import { cn } from '@/lib/utils'

const links: From[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

export const getDate = (from: From) => {
  let formatted
  switch (from) {
    case '1D':
      formatted = '2026-07-23'
      break

    case '1W':
      formatted = '2026-07-18'
      break

    case '1M':
      formatted = '2026-06-24'
      break

    case '3M':
      formatted = '2026-04-24'
      break

    case '1Y':
      formatted = '2025-07-24'
      break

    case '5Y':
      formatted = '2021-07-24'
      break

    default:
      formatted = '2026-06-24'
      break
  }

  return formatted
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
