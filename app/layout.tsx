import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'

const jetBrainsMono = JetBrains_Mono({
  variable: '--font-brains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'FX Checker',
  description:
    'Currency converter app that uses live exchange rates and includes a rate-history chart, multi-currency comparison, favorite pairs, and a conversion log.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${jetBrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
