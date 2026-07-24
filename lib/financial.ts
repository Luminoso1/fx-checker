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

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    signDisplay: 'exceptZero',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value)
}

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  })
    .format(date)
    .replace(',', '')
    .toUpperCase()
}
