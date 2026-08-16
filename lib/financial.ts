export const calculateMetrics = (data: { date: string; rate: number }[]) => {
  if (!data || data.length === 0) return null

  const open = data[0]
  const last = data[data.length - 1]

  const change = last.rate - open.rate
  const percentage = open.rate !== 0 ? (change / open.rate) * 100 : 0

  return {
    open: open.rate,
    last: last.rate,
    lastDateRaw: last.date,
    change,
    percentage,
  }
}
