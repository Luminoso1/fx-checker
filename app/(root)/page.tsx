import { getHistory } from '@/lib/fn'
import { calculateMetrics, formatDate } from '@/lib/financial'
import HistoryChart from '@/components/HistoryChart'
import Menu, { getDate } from '@/components/Menu'
import { StatCard, TrendValue } from '@/components/StatCard'
import { SearchParamsPage } from '@/types'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsPage>
}) {
  const resolvedParams = await searchParams

  const base = resolvedParams.base ?? 'USD'
  const quote = resolvedParams.quote ?? 'EUR'
  const from = getDate(resolvedParams.from ?? '1M')

  const data = await getHistory(from, base, quote)

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
      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-x-4 ">
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

        <Menu searchParams={resolvedParams} />
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
