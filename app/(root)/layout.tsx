import { Suspense } from 'react'
import Converter from '@/components/converter'
import Navigation from '@/components/Navigation'

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="max-w-275 w-full mx-auto lg:px-8 md:px-6 px-4 ">
      <Converter />
      <Suspense fallback={<div>loading...</div>}>
        <Navigation />
      </Suspense>
      {children}
    </div>
  )
}
