import { getCurrencies } from '@/lib/fn'
import Converter from '@/components/Converter'
import Navigation from '@/components/Navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const currencies = await getCurrencies()

  return (
    <div className="max-w-275 w-full mx-auto lg:px-8 md:px-6 px-4 ">
      <Converter currencies={currencies} />
      <Navigation />
      {children}
    </div>
  )
}
