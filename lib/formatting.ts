// 1000 -> 1,000
const amountFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

// 0.01 -> +0.01
const signedDecimalFormatter = new Intl.NumberFormat('en-US', {
  signDisplay: 'always',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
})

// Thu Aug 13 2026 20:29:16 -> 2026-08-13
const shortDateFormatter = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

// 2026-01-01 -> JAN 1 20:17 GMT-5
const longDateTimeZoneFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
  hour12: false,
})

// 2026-01-01 -> Jan 1, 2026
const mediumDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

// 2026-01-01 -> Jan 1
const smallDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
})

export function formatAmount(value: number | string) {
  const num = Number(value)
  if (isNaN(num)) return ''

  return amountFormatter.format(num)
}

export function formatSigedDecimal(value: number) {
  return signedDecimalFormatter.format(value)
}

export function formatShortDate(value: Date) {
  return shortDateFormatter.format(value)
}

export function formatDateTimeWithZone(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()

  const date = new Date(year, month - 1, day, hours, minutes)

  return longDateTimeZoneFormatter.format(date).replace(',', '').toUpperCase()
}

export function formatMediumDate(value: Date) {
  return mediumDateFormatter.format(value)
}

export function formatSmallDate(value: Date) {
  return smallDateFormatter.format(value)
}
