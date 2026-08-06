export interface Currency {
  code: string
  name: string
  startDate: string
  endDate: string
  flag: string
}

export interface Rate {
  date: string
  base: string
  quote: string
  rate: number
}

export type From = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

export interface State {
  base: Currency & { value: string }
  quote: Currency & { value: string }
  rate: string
}
