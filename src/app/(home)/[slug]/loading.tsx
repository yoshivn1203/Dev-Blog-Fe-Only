import { ArrowLeft } from 'lucide-react'

import { Hero } from '@/components/layout/hero'
import { Button } from '@/components/ui/button'

export default function Loading() {
  return (
    <>
      <Hero showWelcome={false} />

      <article className='relative container mx-auto p-2 md:p-6 mt-[-260px] md:mt-[-320px] max-w-6xl'>
        {/* Back button */}
        <Button
          variant='ghost'
          className='pl-0 text-base text-blue-600 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-transparent hover:opacity-80'
        >
          <ArrowLeft className='h-4 w-4' />
          Back to Dashboard
        </Button>

        <div className='prose prose-sm md:prose-base space-y-4 dark:prose-invert max-w-none mt-4'>
          {/* Title skeleton */}
          <div className='h-8 md:h-12 bg-muted rounded-md w-3/4 animate-pulse' />

          {/* Meta info skeleton */}
          <div className='flex text-xs md:text-base items-center gap-2 !mt-2'>
            <div className='h-4 md:h-5 bg-muted rounded-md w-24 animate-pulse' />
            <span>-</span>
            <div className='h-4 md:h-5 bg-muted rounded-md w-32 animate-pulse' />
            <span>-</span>
            <div className='h-4 md:h-5 bg-muted rounded-md w-24 animate-pulse' />
          </div>

          {/* Tags skeleton */}
          <div className='flex flex-wrap gap-2 !mt-2'>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className='h-7 w-24 bg-blue-600/30 dark:bg-blue-900/30 rounded-full animate-pulse'
              />
            ))}
          </div>

          {/* Thumbnail skeleton */}
          <div className='w-full aspect-[16/9] bg-muted rounded-lg !mt-8 animate-pulse' />

          {/* Content skeleton */}
          <div className='space-y-4 mt-8'>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className='space-y-3'>
                <div className='h-4 bg-muted rounded-md w-full animate-pulse' />
                <div className='h-4 bg-muted rounded-md w-5/6 animate-pulse' />
                <div className='h-4 bg-muted rounded-md w-4/6 animate-pulse' />
              </div>
            ))}
          </div>

          {/* Bottom tags section */}
          <div className='mt-8'>
            <div className='h-6 bg-muted rounded-md w-20 mb-2 animate-pulse' />
            <div className='flex flex-wrap gap-2'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='h-7 w-24 bg-blue-600/30 dark:bg-blue-900/30 rounded-full animate-pulse'
                />
              ))}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
