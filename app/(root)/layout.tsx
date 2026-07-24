import { getCurrencies } from '@/lib/fn'
import Converter from '@/components/Converter'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currencies = await getCurrencies()
  return (
    <div className="max-w-275 mx-auto px-8">
      <Converter currencies={currencies} />
      {children}
    </div>
  )
}
