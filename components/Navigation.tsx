'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const ROUTES = [
  { label: 'history', path: '/' },
  { label: 'compare', path: '/compare' },
] as const

const Navigation = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const searchString = useMemo(() => searchParams.toString(), [searchParams])

  return (
    <nav>
      <menu className="mb-5 flex items-center gap-2">
        {ROUTES.map(({ label, path }) => {
          const isActive = pathname === path
          const href = searchString ? `${path}?${searchString}` : path
          return (
            <li key={path}>
              <Link
                href={href}
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
