import { useState, useEffect } from 'react'
import { getRate } from '@/lib/api/frankfurter'

interface ExchangeRateState {
  rate: number | null
  isLoading: boolean
  error: Error | null
}

export function useExchangeRate(base: string, quote: string) {
  const [state, setState] = useState<ExchangeRateState>({
    rate: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function fetchRate() {
      setState({
        rate: null,
        isLoading: true,
        error: null,
      })

      try {
        const rate = await getRate(base, quote, controller.signal)
        setState({
          rate,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        if (controller.signal.aborted) {
          return
        }

        setState({
          rate: null,
          isLoading: false,
          error:
            error instanceof Error ? error : new Error('Unable to fetch rate'),
        })
      }
    }

    fetchRate()

    return () => {
      controller.abort()
    }
  }, [base, quote])

  return state
}
