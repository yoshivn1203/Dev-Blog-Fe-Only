export default function Loading() {
  return (
    <article className='container mx-auto p-6 sm:mt-12 animate-pulse'>
      <div className='prose prose-sm sm:prose-base dark:prose-invert max-w-none'>
        {/* Title skeleton */}
        <div className='h-8 bg-muted rounded-md w-3/4 mb-4'></div>

        {/* Meta info skeleton */}
        <div className='mb-8 flex items-center gap-2'>
          <div className='h-4 bg-muted rounded-md w-24'></div>
          <span>-</span>
          <div className='h-4 bg-muted rounded-md w-32'></div>
          <span>-</span>
          <div className='h-4 bg-muted rounded-md w-24'></div>
        </div>

        {/* Thumbnail skeleton */}
        <div className='w-full h-[240px] sm:h-[480px] bg-muted rounded-lg mb-8'></div>

        {/* Content skeleton */}
        <div className='space-y-4'>
          <div className='h-4 bg-muted rounded-md w-full'></div>
          <div className='h-4 bg-muted rounded-md w-5/6'></div>
          <div className='h-4 bg-muted rounded-md w-4/6'></div>
          <div className='h-4 bg-muted rounded-md w-full'></div>
        </div>

        {/* Tags skeleton */}
        <div className='flex flex-wrap gap-2 mt-4 mb-8'>
          {[1, 2, 3].map(i => (
            <div key={i} className='px-2 py-1 w-16 h-6 bg-muted rounded-full'></div>
          ))}
        </div>
      </div>
    </article>
  )
}
