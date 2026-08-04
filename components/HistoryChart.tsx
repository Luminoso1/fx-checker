'use client'

import { Rate } from '@/types'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
} from 'chart.js/auto'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  elements: { point: { pointStyle: 'line' } },
  interaction: { mode: 'index', intersect: false },
  layout: {
    padding: {},
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      padding: 10,
      backgroundColor: '#171719',
      titleColor: '#FFFFFF',
      bodyColor: '#CEF739',
      borderColor: '#2D2D30',
      borderWidth: 1,
      callbacks: {
        title: (items) => {
          if (!items.length) return

          const rawDate = items[0].label
          const date = new Date(`${rawDate}T00:00:00`)
          return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(date)
        },
        label: (context) => {
          const rawValue = context.parsed.y

          if (rawValue === null || rawValue === undefined) return ''

          const value = new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 4,
          }).format(rawValue)

          return `Change: ${value}`
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: true },
      ticks: {
        color: '#9D9D9D',
        maxTicksLimit: 5,
        maxRotation: 0,
        padding: 16,
        align: 'inner',
        includeBounds: true,
        callback: function (value, index) {
          const totalLabels = this.chart.data.labels?.length || 0

          const step = Math.ceil(totalLabels / 4)

          const isFirst = index === 0
          const isLast = index === totalLabels - 1
          const isMiddle = index % step === 0

          if (isFirst || isLast || isMiddle) {
            const rawDate = this.getLabelForValue(value as number)
            const date = new Date(`${rawDate}T00:00:00`)

            return new Intl.DateTimeFormat('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }).format(date)
          }

          return null
        },
      },
    },
    y: {
      grid: { color: '#2E2E2E' },
      ticks: {
        color: '#9D9D9D',
        maxTicksLimit: 3,
        padding: 16,
      },
    },
  },
}

const HistoryChart = ({ rates }: { rates: Rate[] }) => {
  const data: ChartData<'line'> = {
    labels: rates.map((rate) => rate.date),
    datasets: [
      {
        fill: true,
        label: 'Change',
        data: rates.map((rate) => rate.rate),
        borderColor: '#CEF739',
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const chart = context.chart
          const { ctx, chartArea } = chart

          if (!chartArea) {
            return undefined
          }

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          )
          gradient.addColorStop(0, 'rgba(206, 247, 57, 0.5)')
          gradient.addColorStop(1, 'rgba(23, 23, 25, 0)')

          return gradient
        },
      },
    ],
  }
  return (
    <div className="relative w-full h-80">
      <Line options={options} data={data} />
    </div>
  )
}

export default HistoryChart
