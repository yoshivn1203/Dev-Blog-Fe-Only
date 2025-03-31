import { format } from 'date-fns'
import { ArrowLeft, Tag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { Code } from '@/components/Code'
import { Hero } from '@/components/layout/hero'
import { Button } from '@/components/ui/button'

import { getPostBySlug } from '../actions'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      notFound()
    }

    const Tags = ({ className }: { className?: string }) => {
      return (
        <div className={`flex flex-wrap gap-2 mb-8 ${className ?? ''}`}>
          {post.tags?.map((tag: string, index: number) => (
            <div
              key={index}
              className='px-3 py-1 text-xs rounded-full bg-blue-400 dark:bg-blue-900 text-white flex items-center gap-2'
            >
              <Tag className='w-4 h-4' /> {tag}
            </div>
          ))}
        </div>
      )
    }

    return (
      <>
        <Hero showWelcome={false} />

        <article className='relative container mx-auto p-2 md:p-6 mt-[-260px] md:mt-[-320px] max-w-6xl '>
          <Link href='/'>
            <Button
              variant='ghost'
              className='pl-0 text-base  text-blue-600 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-transparent hover:opacity-80'
            >
              <ArrowLeft className='h-4 w-4' />
              Back to Dashboard
            </Button>
          </Link>
          <div className='prose prose-sm md:prose-base dark:prose-invert max-w-none mt-4'>
            <h1 className='text-2xl md:text-4xl font-bold !mb-2'>{post.title}</h1>
            <div className='flex text-xs md:text-base items-center gap-2 text-muted-foreground'>
              <span>By {post.author}</span>
              <span>-</span>
              <time className='text-muted-foreground'>
                {format(new Date(post.date), 'MMM d, yyyy')}
              </time>
              <span>-</span>
              <span>{post.reading_time} mins read</span>
            </div>

            <Tags className='mt-2' />
            {post.thumbnail && (
              <Image
                src={post.thumbnail}
                alt={post.title}
                width={1024}
                height={768}
                className='w-full h-auto aspect-[16/9] object-cover rounded-lg mb-8 mt-8'
                placeholder='blur'
                blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODA4MDgwIiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4='
                priority
              />
            )}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                h1: ({ ...props }) => (
                  <h1
                    className='text-3xl font-bold mt-8 mb-4 border-b-1 border-gray-200'
                    {...props}
                  />
                ),
                h2: ({ ...props }) => (
                  <div
                    className='text-2xl font-bold mt-6 mb-4 !border-b-2 !border-gray-200'
                    {...props}
                  />
                ),
                iframe: ({ ...props }) => (
                  <div className='relative w-full aspect-video'>
                    <iframe {...props} className='absolute inset-0 w-full h-full' />
                  </div>
                ),
                //code block (```) and mermaid diagram has a pre tag as parent
                pre: ({ children, ...props }) => (
                  <pre
                    className='!bg-blue-100 dark:!bg-gray-600 !p-0 rounded-lg overflow-x-auto'
                    {...props}
                  >
                    {children}
                  </pre>
                ),
                //this is code for both inline and block code
                code: Code
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
          <p className='text-sm md:text-base lg:text-lg font-bold mt-8'>Tags:</p>
          <Tags className='mt-2' />
        </article>
      </>
    )
  } catch (error) {
    console.error('Error fetching post:', error)
    notFound()
  }
}
