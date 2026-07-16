import { getCurrencies } from '@/lib/fn'
import Converter from '@/components/Converter'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currencies = await getCurrencies()
  return (
    <div className="">
      <Converter currencies={currencies} />
      {children}
    </div>
  )
}
