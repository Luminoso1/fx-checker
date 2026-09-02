import Modal from './modal'
import Rates from './list'

import { Currency } from '@/types'
import { Result } from '@/lib/api/frankfurter'

import { formatAmount } from '@/lib/formatting'

interface Props {
  base: string
  amount: number
  rates: Result[]
  currencies: Currency[]
  quotes: string
}

function Compare({ base, amount, rates, currencies, quotes }: Props) {
  const formattedAmount = formatAmount(amount)
  const pairsLength = rates.length

  return (
    <div className="relative bg-neutral-700 border border-neutral-600 rounded-2xl p-4 md:p-5 h-130">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-5">
          <p className="hidden sm:block text-neutral-200 uppercase tracking-[1px] text-sm">
            MULTI-CURRENCY
          </p>
          <p className="uppercase tracking-[1px] text-base">
            {formattedAmount} from {base}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-neutral-200 text-sm uppercase tracking-[1px]">
            {pairsLength} pairs
          </p>
          <Modal initialCurrencies={currencies} quotes={quotes} />
        </div>
      </div>

      <Rates rates={rates} />
    </div>
  )
}

export default Compare
