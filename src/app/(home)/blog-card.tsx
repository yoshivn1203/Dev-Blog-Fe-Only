import { format } from 'date-fns'
import { Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import type { Post } from './actions'

export function BlogCard({ post }: { post: Post }) {
  return (
    <Link href={`/${post.slug}`}>
      <Card className='h-full overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800'>
        <div className='md:flex md:h-56'>
          {post.thumbnail && (
            <div className='relative w-full h-44 md:w-96 md:h-56 bg-muted flex-shrink-0'>
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className='object-cover'
                placeholder='blur'
                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODA4MDgwIiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4='
              />
            </div>
          )}
          <div className='flex-grow h-full flex flex-col justify-between'>
            <div>
              <CardHeader className='pb-4'>
                <CardTitle className='line-clamp-2'>{post.title}</CardTitle>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span>{post.author}</span>
                  <span>-</span>
                  <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <span className='text-xs'>{post.reading_time} mins read</span>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className='line-clamp-3'>{post.description}</CardDescription>
              </CardContent>
            </div>
            <div className='flex flex-wrap gap-2 pl-4 pb-4'>
              {post.tags?.map((tag: string, index: number) => (
                <div
                  key={index}
                  className='px-3 py-1 text-xs rounded-full bg-blue-400 dark:bg-blue-900 text-white flex items-center gap-2'
                >
                  <Tag className='w-4 h-4' /> {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
