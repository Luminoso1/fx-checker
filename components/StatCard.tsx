import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/financial'

interface StatCardProps {
  label: string
  value: React.ReactNode
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="py-3 px-5 bg-neutral-700 border border-neutral-600 rounded-2xl min-w-35">
      <span className="text-sm uppercase tracking-[1px] mb-4 block text-neutral-100">
        {label}
      </span>
      <span className="text-xl">{value}</span>
    </div>
  )
}

interface TrendValueProps {
  value: number
  isPercentage?: boolean
}

export const TrendValue = ({
  value,
  isPercentage = false,
}: TrendValueProps) => {
  const isPositive = value >= 0
  const formatted = formatCurrency(value)
  return (
    <span
      className={cn(
        'text-xl',
        'flex items-start gap-2',
        isPositive ? 'text-green-500' : 'text-red-500',
      )}
    >
      {isPercentage && (
        <span
          className={cn('transition duration-500', isPositive ? 'rotate-0' : 'rotate-180')}
        >
          ▲
        </span>
      )}
      {formatted}
      {isPercentage && '%'}
    </span>
  )
}
