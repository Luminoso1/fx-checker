'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'

import { Button } from '@/components/ui/button'

import { Currency } from '@/types'

import { useCurrencyQuery } from '@/hooks/useCurrencyQuery'
import { useCurrencies } from '@/hooks/useCurrencies'

import { cn } from '@/lib/utils'

const Trigger = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick: () => void
}) => {
  return (
    <Button onClick={onClick} className="space-y-1 p-1">
      <div className="relative w-5 h-3">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 block w-5 h-[1.5px] bg-neutral-100 origin-center"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-1.25 left-0 block w-5 h-[1.5px] bg-neutral-100"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 block w-5 h-[1.5px] bg-neutral-100 origin-center"
        />
      </div>
    </Button>
  )
}

const Modal = ({
  initialCurrencies,
  quotes,
}: {
  initialCurrencies: Currency[]
  quotes: string
}) => {
  const { currencies, query, setQuery } = useCurrencies(initialCurrencies)
  const { setQuotes } = useCurrencyQuery()

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const toggle = () => {
    setIsOpen((prev) => !prev)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  }

  return (
    <>
      <div className="z-50 flex items-center justify-between space-x-5">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onAnimationComplete={() => {
              if (!hasAnimated) setHasAnimated(true)
            }}
            className="absolute top-3.5 right-10 focus-within:outline-2 outline-lime-500 focus-within:border-transparent border border-neutral-200 rounded-md px-3 flex gap-2.5 items-center"
          >
            <span aria-hidden="true">🔍️</span>
            <input
              ref={inputRef}
              type="text"
              aria-label="Search currencies by name or code"
              placeholder="Search currencies..."
              className="flex-1 p-1 outline-none placeholder:text-xs"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </motion.div>
        )}
        <Trigger isOpen={isOpen} onClick={toggle} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="pt-16 absolute inset-0 p-5 rounded-2xl z-10 bg-neutral-700"
          >
            <motion.ol
              tabIndex={-1}
              variants={!hasAnimated ? containerVariants : undefined}
              initial={!hasAnimated ? 'hidden' : false}
              animate="visible"
              className="grid grid-cols-4 auto-rows-10 gap-4 overflow-y-auto h-105 p-1"
            >
              {currencies.map(({ code, name, flag }) => {
                const isActive = quotes.includes(code)
                return (
                  <motion.li key={code} variants={itemVariants}>
                    <Button
                      onClick={() => setQuotes(code)}
                      className={cn(
                        'w-full min-w-0 bg-neutral-500 text-left',
                        'rounded-lg p-2 border-2',
                        'flex items-center gap-2',
                        isActive ? 'border-lime-500' : 'border-neutral-400',
                      )}
                    >
                      <span className="shrink-0 text-sm">{flag}</span>
                      <span className="min-w-0 truncate text-sm">{name}</span>
                    </Button>
                  </motion.li>
                )
              })}
            </motion.ol>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Modal
