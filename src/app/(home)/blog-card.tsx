import { format } from 'date-fns'
import { Star, StarHalf } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Post } from './actions'

export function BlogCard({ post }: { post: Post }) {
  const rating = post.rating || 0
  const fullStars = Math.floor(rating)
  const hasHalfStar = Number(rating) % 1 >= 0.5

  return (
    <Link href={`/${post.slug}`}>
      <Card className='h-full overflow-hidden hover:shadow-lg transition-shadow'>
        {post.thumbnail && (
          <div className='relative w-full h-48'>
            <Image src={post.thumbnail} alt={post.title} fill className='object-cover' />
          </div>
        )}
        <CardHeader>
          <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
          <div className='flex items-center gap-3 text-sm text-muted-foreground'>
            {post.rating && (
              <div className='flex items-center text-yellow-500'>
                {[...Array(fullStars)].map((_, i) => (
                  <Star key={i} className='w-4 h-4 fill-current' />
                ))}
                {hasHalfStar && <StarHalf className='w-4 h-4 fill-current' />}
              </div>
            )}
            <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
            {post.reading_time && <span>.</span>}
            {post.reading_time && <span>{post.reading_time} min read</span>}
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className='line-clamp-3'>{post.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
