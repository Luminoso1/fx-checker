import { useState, useCallback, useMemo } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import { Currency } from '@//types'
import Arrow from './Arrow'

const Select = ({
  param,
  current,
  initialCurrencies,
}: {
  param: 'base' | 'quote'
  current: Currency
  initialCurrencies: Currency[]
}) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const { query, setQuery, currencies } = useCurrencies(initialCurrencies)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSelect = useCallback(
    (code: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(param, code)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })

      setIsOpen(false)
      setQuery('')
    },
    [param, router, searchParams, pathname, setQuery],
  )

  return (
    <div className="relative">
      <button
        className="p-2 bg-neutral-500 border border-neutral-400 rounded-lg flex items-center gap-2"
        onClick={handleToggle}
      >
        <span>
          {current.flag} {current.code}
        </span>
        <Arrow
          className={`${isOpen ? 'rotate-180' : ''} transition-all duration-300`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-sm mt-2 right-0 max-w-md bg-neutral-600 border border-neutral-400 rounded-lg p-2">
          {/* search currency */}
          <div className="border border-neutral-200 focus-within:outline rounded-md mb-2.5 px-3 flex gap-2.5 items-center">
            <span>🔍️</span>
            <input
              placeholder="Colombian Peso..."
              className="flex-1 py-2.5 outline-none"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          {/* currencies */}
          <div className="border border-neutral-800 rounded-lg flex flex-col gap-0 max-h-100 overflow-y-auto">
            {currencies.map((c) => {
              const { code, name, flag } = c
              const isSelected = current.code === code
              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`text-left p-2 rounded-md hover:bg-neutral-800 transition-colors px-2 py-3 flex justify-between ${
                    isSelected
                      ? 'bg-neutral-800 font-bold text-teal-400'
                      : 'text-neutral-300'
                  }`}
                >
                  <span className="flex gap-3 items-center">
                    {flag}
                    <span className="text-neutral-50 text-sm">{code}</span>
                    <span className="text-neutral-200 text-xs">{name}</span>
                  </span>

                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#ffffff"
                        d="M18.9 8.1L9 18l-4.95-4.95l.71-.71L9 16.59l9.19-9.2z"
                      ></path>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const useCurrencies = (initial: Currency[]) => {
  const [currencies] = useState<Currency[]>(initial || [])
  const [query, setQuery] = useState('')

  const filteredCurrencies = useMemo(() => {
    if (!query.trim()) return currencies

    const normalized = query.toLowerCase().trim()

    return currencies.filter((c) => {
      const nameMatch = c.name.toLowerCase().includes(normalized)
      const codeMatch = c.code.toLowerCase().includes(normalized)

      return nameMatch || codeMatch
    })
  }, [currencies, query])

  return { currencies: filteredCurrencies, query, setQuery }
}

export default Select
