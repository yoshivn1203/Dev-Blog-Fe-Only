import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { Hero } from '@/components/layout/hero'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  //only allow access admin on localhost
  if (!host.includes('localhost')) {
    notFound()
  }

  return (
    <>
      <Hero showWelcome={false} />
      <div className='relative container px-2 md:px-4  mt-[-280px] md:mt-[-320px] max-w-8xl mx-auto'>
        <div className='flex items-center justify-between mb-8'></div>
        {children}
      </div>
    </>
  )
}
