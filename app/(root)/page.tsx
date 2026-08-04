'use client'
import { calculateMetrics, formatDate } from '@/lib/financial'
import HistoryChart from '@/components/HistoryChart'
import Menu from '@/components/Menu'
import { StatCard, TrendValue } from '@/components/StatCard'
import { useSearch } from '@/hooks/useSearch'
import { useHistory } from '@/hooks/useHistory'

export default function Page() {
  const { base, quote } = useSearch()
  const { data } = useHistory()

  const metrics = calculateMetrics(data)

  if (!metrics) {
    return (
      <div className="p-5 text-center text-neutral-400">Opps! I am ampty</div>
    )
  }

  const lastFormattedDate = formatDate(metrics.lastDateRaw)

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
            {metrics.last} · {lastFormattedDate}
          </p>
        </div>
        <HistoryChart rates={data} />
      </div>
    </section>
  )
}
