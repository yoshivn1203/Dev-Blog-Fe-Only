'use client'

import './globals.css'

import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { Geist, Geist_Mono } from 'next/font/google'
import React, { Suspense } from 'react'
import { Provider } from 'react-redux'
import { useSelector } from 'react-redux'

import GoogleAnalytics from '@/components/GoogleAnalytics'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { RootState, store } from '@/store/store'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

function LoadingSpinner() {
  return (
    <div className='h-[80vh] w-full flex flex-col items-center justify-center gap-4'>
      <Loader2 className='h-8 w-8 animate-spin text-primary' />
      <p className='text-muted-foreground'>Loading...</p>
    </div>
  )
}

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const isDark = useSelector((state: RootState) => state.theme.isDark)

  return (
    //add className='dark' to html tag to enable dark mode
    <html
      lang='en'
      className={clsx({
        dark: isDark
      })}
    >
      <meta property='og:title' content='Danang Dental Care' />
      <meta
        property='og:description'
        content='Danang Dental Care connects international patients with dental clinics in Da Nang, Vietnam.'
      />
      <meta property='og:image' content='url_to_image' />
      <meta property='og:url' content='your_site_url' />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen flex flex-col`}
      >
        <GoogleAnalytics GA_MEASUREMENT_ID='G-0FC2VFHBGG' />
        <Header />
        <Suspense fallback={<LoadingSpinner />}>
          <main className='mx-auto flex-1 w-full'>{children}</main>
        </Suspense>
        <Footer />
      </body>
    </html>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <RootLayoutContent>{children}</RootLayoutContent>
    </Provider>
  )
}
