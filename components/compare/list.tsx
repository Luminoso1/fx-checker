'use client'

import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Result } from '@/lib/api/frankfurter'

const List = ({ rates }: { rates: Result[] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.ol
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-3 h-105 overflow-y-auto"
    >
      {rates.map(({ code, name, flag, rate, amount }) => (
        <motion.li
          key={code}
          variants={itemVariants}
          className="bg-neutral-600 border border-neutral-500 rounded-xl flex items-center justify-between py-3 px-4"
        >
          <div className="flex items-center gap-5">
            <span className="text-xl">{flag}</span>
            <div>
              <span className="block text-sm">{code}</span>
              <p className="text-xs text-neutral-200">{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-right">
              <span className="block">{amount}</span>
              <span className="inline text-xs text-neutral-200">@ {rate}</span>
            </div>
            <Button className="border border-neutral-300 size-10 grid place-content-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 13 12"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.59811 0.413133C5.87936 -0.149367 6.67623 -0.12593 6.93404 0.413133L8.48092 3.53032L11.9028 4.02251C12.5122 4.11626 12.7465 4.86626 12.3012 5.31157L9.84029 7.72563L10.4262 11.1241C10.52 11.7334 9.86373 12.2022 9.32467 11.9209L6.27779 10.3038L3.20748 11.9209C2.66842 12.2022 2.01217 11.7334 2.10592 11.1241L2.69186 7.72563L0.230918 5.31157C-0.214394 4.86626 0.0199805 4.11626 0.629356 4.02251L4.07467 3.53032L5.59811 0.413133Z"
                  fill="none"
                  stroke="currentColor"
                />
              </svg>
            </Button>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

export default List
