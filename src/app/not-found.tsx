'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className='h-[80vh] flex flex-col items-center justify-center gap-6'>
      <h1 className='text-4xl font-bold'>404 - Page Not Found</h1>
      <p className='text-muted-foreground text-lg'>The page you are looking for does not exist.</p>
      <div className='flex gap-4'>
        <button
          onClick={() => router.back()}
          className='px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors'
        >
          Go Back
        </button>
        <Link
          href='/'
          className='px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors'
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
