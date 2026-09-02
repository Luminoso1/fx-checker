import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { useCurrencyQuery } from '@/hooks/useCurrencyQuery'
import { useCurrencies } from '@/hooks/useCurrencies'

import { Button } from '@/components/ui/button'
import { Arrow } from '@/components/icons/arrow'
import { Check } from '@/components/icons/check'

import { cn } from '@/lib/utils'

import { Currency, Field } from '@/types'

const Select = ({
  param,
  current,
  initialCurrencies,
}: {
  param: Field
  current: Currency
  initialCurrencies: Currency[]
}) => {
  const { setCurrency } = useCurrencyQuery()
  const { query, currencies, setQuery } = useCurrencies(initialCurrencies)

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { containerRef, buttonRef, inputRef } = useFocusTrap(isOpen, setIsOpen)

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [setIsOpen])

  const handleSelect = useCallback(
    (code: string) => {
      setCurrency(param, code)

      setIsOpen(false)
      setQuery('')
    },
    [param, setQuery, setCurrency, setIsOpen],
  )

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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="listbox"
            className="absolute z-10 w-77.5 sm:w-93.75 mt-2 -right-4 max-w-md bg-neutral-600 border border-neutral-400 rounded-lg p-2"
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 470, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* search currency */}
            <div className="focus-within:outline-2 outline-lime-500 focus-within:border-transparent border border-neutral-200 rounded-md mb-2.5 px-3 flex gap-2.5 items-center">
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

            <div
              tabIndex={-1}
              className="rounded-lg flex flex-col gap-0 max-h-100 overflow-y-auto overflow-x-visible p-1"
            >
              {currencies.map((c) => {
                const { code, name, flag } = c
                const isSelected = current.code === code

                return (
                  <div key={code}>
                    <Button
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(code)}
                      className={cn(
                        'w-full outlined',
                        'text-left rounded-md px-2 py-3 flex justify-between',
                        'hover:bg-neutral-800 transition-colors',
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
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const useFocusTrap = (
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
  }, [isOpen, setIsOpen])

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
  }, [setIsOpen])

  // auto focus input when menu search is open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  return { isOpen, setIsOpen, containerRef, buttonRef, inputRef }
}

export default Select
