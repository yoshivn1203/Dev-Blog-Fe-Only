import { Hero } from '@/components/layout/hero'

export default function Loading() {
  return (
    <>
      <Hero showWelcome={true} />
      <div className='relative container mx-auto p-2 md:p-6 max-w-6xl mt-[-80px] md:mt-[-100px]'>
        <p className='text-base md:text-lg font-bold text-left'>Latest posts</p>
        <div className='h-[1px] w-full bg-gray-200 dark:bg-gray-700 mb-6'></div>
        <div className='flex flex-col gap-6'>
          {/* Generate 3 skeleton cards */}
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='flex flex-col md:flex-row gap-6 rounded-lg border bg-card p-4 animate-pulse'
            >
              {/* Thumbnail skeleton */}
              <div className='w-full md:w-1/3'>
                <div className='aspect-video bg-muted rounded-lg' />
              </div>

              {/* Content skeleton */}
              <div className='w-full md:w-2/3 space-y-4'>
                {/* Title skeleton */}
                <div className='h-7 bg-muted rounded-md w-3/4' />

                {/* Description skeleton */}
                <div className='space-y-2'>
                  <div className='h-4 bg-muted rounded-md w-full' />
                  <div className='h-4 bg-muted rounded-md w-5/6' />
                </div>

                {/* Meta info skeleton */}
                <div className='flex items-center gap-2'>
                  <div className='h-4 bg-muted rounded-md w-24' />
                  <span className='text-muted-foreground'>•</span>
                  <div className='h-4 bg-muted rounded-md w-20' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
