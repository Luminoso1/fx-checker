import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

import { SHORT_DATE_VALUES } from '@/lib/days'

import { useCurrencyQuery } from '@/hooks/useCurrencyQuery'

function Menu() {
  const { from, setFrom } = useCurrencyQuery()
  return (
    <menu className="bg-neutral-700 border border-neutral-700 rounded-lg flex">
      {SHORT_DATE_VALUES.map((value) => {
        const isActive = from === value
        return (
          <li key={value}>
            <Button
              type="button"
              aria-label={`search from=${value}`}
              aria-selected={isActive}
              onClick={() => setFrom(value)}
              className={cn(
                'px-4 py-3 text-xs',
                'outlined rounded-lg',
                'transition-colors',
                isActive
                  ? 'bg-neutral-500 text-neutral-50'
                  : 'text-neutral-200',
              )}
            >
              <span aria-hidden>{value}</span>
            </Button>
          </li>
        )
      })}
    </menu>
  )
}

export default Menu
