'use client'

import React from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container px-2 md:px-4 mt-36 md:mt-24 max-w-8xl mx-auto'>
      <div className='flex items-center justify-between mb-8'></div>
      {children}
    </div>
  )
}
