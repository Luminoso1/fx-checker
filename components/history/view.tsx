'use client'

import HistoryChart from './chart'
import Menu from './menu'
import { StatCard, TrendValue } from './stat'

import { useCurrencyQuery } from '@/hooks/useCurrencyQuery'
import { calculateMetrics } from '@/lib/financial'
import { formatDateTimeWithZone } from '@/lib/formatting'

import { Rate } from '@/types'

export default function View({ data }: { data: Rate[] }) {
  const { base, quote } = useCurrencyQuery()

  const metrics = calculateMetrics(data)

  if (!metrics) {
    return (
      <div className="p-5 text-center text-neutral-400">Opps! I am empty</div>
    )
  }

  const lastDate = formatDateTimeWithZone(metrics.lastDateRaw)

  return (
    <section>
      {/* stats  & menu */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center items-start mb-5 gap-y-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-4 gap-x-4">
          <StatCard label="open" value={metrics.open} />

          <StatCard label="last" value={metrics.last} />

          <StatCard
            label="change"
            value={<TrendValue value={metrics.change} />}
          />

          <StatCard
            label="% change"
            value={<TrendValue value={metrics.percentage} isPercentage />}
          />
        </div>

        <Menu />
      </div>

      {/* chart */}
      <div className="p-5 bg-neutral-700 border border-neutral-600 rounded-2xl">
        <div className="flex items-center justify-between mb-5">
          <p className="font-medium text-base tracking-[1px]">
            <span>{base}</span>/<span>{quote}</span>
          </p>
          <p className="text-xs text-neutral-200 tracking-[0.5px]">
            {metrics.last} · {lastDate}
          </p>
        </div>
        <HistoryChart rates={data} />
      </div>
    </section>
  )
}
