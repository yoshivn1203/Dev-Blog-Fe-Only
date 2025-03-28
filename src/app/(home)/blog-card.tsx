import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Post } from './actions'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.slug}`}>
      <Card className='h-full overflow-hidden hover:shadow-lg transition-shadow md:min-w-[400px] dark:bg-gray-800'>
        {post.thumbnail && (
          <div className='relative w-full h-48 bg-muted'>
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className='object-cover'
              placeholder='blur'
              blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjM2NmYxIiBzdG9wLW9wYWNpdHk9IjAuMiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzhiNWNmNiIgc3RvcC1vcGFjaXR5PSIwLjIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+'
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>{post.author}</span>
            <span>-</span>
            <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
          </div>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <span>{post.reading_time} mins read</span>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className='line-clamp-3'>{post.description}</CardDescription>

          <div className='flex flex-wrap gap-2 mt-4'>
            {post.tags?.map((tag: string, index: number) => (
              <span
                key={index}
                className='px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground'
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
