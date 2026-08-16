export function calculateQuote(amount: number, rate: number): number {
  return amount * rate
}

export function calculateBase(amount: number, rate: number): number {
  if (rate === 0) {
    return 0
  }

  return amount / rate
}

export function sanitizeAmount(value: string) {
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
}

export function parseAmount(value: string) {
  if (value.trim() === '') {
    return null
  }

  const number = Number(value)

  return Number.isFinite(number) ? number : null
}
