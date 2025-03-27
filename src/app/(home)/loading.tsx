export default function Loading() {
  return (
    <div className='container mx-auto p-6 sm:mt-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Generate 6 skeleton cards */}
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className='rounded-lg border bg-card animate-pulse'>
            {/* Thumbnail skeleton */}
            <div className='aspect-video bg-muted rounded-t-lg' />

            <div className='p-4'>
              {/* Title skeleton */}
              <div className='h-6 bg-muted rounded-md w-3/4 mb-2' />

              {/* Description skeleton */}
              <div className='space-y-2 mb-4'>
                <div className='h-4 bg-muted rounded-md w-full' />
                <div className='h-4 bg-muted rounded-md w-5/6' />
              </div>

              {/* Meta info skeleton */}
              <div className='flex items-center gap-2'>
                <div className='h-4 bg-muted rounded-md w-24' />
                <span>•</span>
                <div className='h-4 bg-muted rounded-md w-20' />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
