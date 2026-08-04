'use client'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const routes = [
  { label: 'history', path: '/' },
  { label: 'compare', path: '/compare' },
]

const Navigation = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const setRoutePath = (path: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const searchString = params.toString()
    return searchParams ? `${path}?${searchString}` : path
  }

  return (
    <nav>
      <menu className="mb-5 flex items-center gap-2">
        {routes.map(({ label, path }) => {
          const isActive = pathname === path
          return (
            <li key={path}>
              <Link
                href={`${setRoutePath(path)}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'px-4 py-2 tracking-[1px]  uppercase font-semibold',
                  'outlined rounded-sm border-b block',
                  isActive
                    ? 'border-lime-500'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200',
                )}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </menu>
    </nav>
  )
}

export default Navigation
