import { useState, useEffect } from 'react'
import { getHistory } from '@/lib/fn'
import { getDate } from '@/components/Menu'
import { From, Rate } from '@/types'
import { useSearch } from './useSearch'

export const useHistory = () => {
  const { base, quote, from } = useSearch()
  const fromDate = getDate(from as From)

  const [data, setData] = useState<Rate[]>([])

  useEffect(() => {
    getHistory(fromDate, base, quote).then(setData)
  }, [base, quote, fromDate])

  return { data }
}
