import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useSearch } from '@/hooks/useSearch'
import { Button } from '@/components/ui/button'
import { Arrow } from '@/components/icons/arrow'
import { Check } from '@/components/icons/check'
import { cn } from '@/lib/utils'

import { Currency } from '@/types'

const Select = ({
  param,
  current,
  initialCurrencies,
}: {
  param: 'base' | 'quote'
  current: Currency
  initialCurrencies: Currency[]
}) => {
  const { setParam } = useSearch()
  const { query, currencies, setQuery } = useCurrencies(initialCurrencies)

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const handleSelect = useCallback(
    (code: string) => {
      setParam(param, code)

      setIsOpen(false)
      setQuery('')
    },
    [param, setQuery, setParam],
  )

  // close menu with 'ESC'
  useEffect(() => {
    const handleKeydownEsc = (event: KeyboardEvent) => {
      const key = event.key
      if (key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeydownEsc)
    }
    return () => document.removeEventListener('keydown', handleKeydownEsc)
  }, [isOpen])

  // close menu when click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // auto focus input when menu search is open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="shrink-0 relative">
      <Button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Select currency, current is ${current.name}`}
        onClick={handleToggle}
        className="outlined h-full p-2 bg-neutral-500 border border-neutral-400 rounded-lg flex items-center gap-2"
      >
        <span aria-hidden="true">
          {current.flag} {current.code}
        </span>
        <Arrow
          className={cn('transition-all duration-300', isOpen && 'rotate-180')}
        />
      </Button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute z-10 w-77.5 sm:w-93.75 mt-2 -right-4 max-w-md bg-neutral-600 border border-neutral-400 rounded-lg p-2"
        >
          {/* search currency */}
          <div className="border border-neutral-200 focus-within:outline rounded-md mb-2.5 px-3 flex gap-2.5 items-center">
            <span aria-hidden="true">🔍️</span>
            <input
              ref={inputRef}
              type="text"
              aria-label="Search currencies by name or code"
              placeholder="Search currencies..."
              className="flex-1 py-2.5 outline-none placeholder:text-xs"
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
                <Button
                  key={code}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(code)}
                  className={cn(
                    'text-left p-2 rounded-md px-2 py-3 flex justify-between',
                    'hover:bg-neutral-800 transition-colors ',
                    isSelected
                      ? 'bg-neutral-800 font-bold text-teal-400'
                      : 'text-neutral-300',
                  )}
                >
                  <span className="flex gap-3 items-center">
                    <span className="text-sm" aria-hidden="true">
                      {flag}
                    </span>
                    <span className="text-neutral-50 text-sm">{code}</span>
                    <span className="text-neutral-200 text-xs">{name}</span>
                  </span>

                  {isSelected && <Check />}
                </Button>
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
