export interface SearchParams {
  from?: string
  base?: string
  quote?: string
  amount?: string
  quotes?: string
}

export interface Currency {
  code: string
  name: string
  flag: string
}

export interface Rate {
  date: string
  base: string
  quote: string
  rate: number
}

export type From = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y'

export type Field = 'base' | 'quote'
