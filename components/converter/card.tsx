import { cn } from '@/lib/utils'
import Select from './select'
import { Currency, Field } from '@/types'

interface Props {
  label: 'send' | 'receive'
  name: Field
  value: string
  className?: string
  currency: Currency
  currencies: Currency[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CurrencyCard = ({
  label,
  name,
  value,
  className,
  currency,
  currencies,
  onChange,
}: Props) => {
  return (
    <div className="flex-1 bg-neutral-600 border border-neutral-500 p-4 sm:p-5 rounded-2xl">
      <label className="uppercase text-sm text-neutral-100 mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="flex items-center justify-between gap-2">
        <input
          type="text"
          name={name}
          id={name}
          aria-label={`Amount to send in ${currency.name}`}
          inputMode="decimal"
          value={value}
          onChange={onChange}
          className={cn(
            'outlined rounded-lg flex-1 shrink-0 w-full',
            'text-[32px] md:text-[40px] font-bold ',
            'hover:underline underline-offset-4',
            className,
          )}
        />
        <Select
          param={name}
          current={currency}
          initialCurrencies={currencies}
        />
      </div>
    </div>
  )
}

export default CurrencyCard
