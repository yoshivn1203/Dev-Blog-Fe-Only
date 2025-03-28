import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw' // ✅ Allow raw HTML
import remarkGfm from 'remark-gfm'

import { getPostBySlug } from '../actions'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const post = await getPostBySlug(slug)

  return (
    <article className='container mx-auto p-6 mt-32 md:mt-24 max-w-6xl'>
      <div className='prose prose-sm md:prose-base space-y-4 dark:prose-invert max-w-none'>
        <h1 className='text-2xl md:text-3xl font-bold mb-4'>{post.title}</h1>
        <div className='mb-8 flex items-center gap-2 text-muted-foreground'>
          <span>{post.author}</span>
          <span>-</span>
          <span>{post.reading_time} mins read</span>
          <span>-</span>
          <time className='text-muted-foreground'>{new Date(post.date).toLocaleDateString()}</time>
        </div>
        {post.thumbnail && (
          // <img
          //   src={post.thumbnail}
          //   alt={post.title}
          //   className='w-full h-[240px] sm:h-[480px] object-cover rounded-lg mb-8'
          // />
          <Image
            src={post.thumbnail}
            alt={post.title}
            width={1024}
            height={768}
            className='w-full h-auto aspect-[16/9] object-cover rounded-lg mb-8'
            placeholder='blur'
            blurDataURL='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNlNWU1ZTUiIHN0b3Atb3BhY2l0eT0iMC4zIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjODA4MDgwIiBzdG9wLW9wYWNpdHk9IjAuMyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4='
            priority
          />
        )}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            iframe: ({ ...props }) => (
              <div className='relative w-full aspect-video'>
                <iframe {...props} className='absolute inset-0 w-full h-full' />
              </div>
            ),
            //code block
            pre: ({ children, ...props }) => (
              <pre
                className='bg-blue-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto'
                {...props}
              >
                {children}
              </pre>
            ),
            //code line
            code: ({ children, ...props }: any) => {
              return (
                <code
                  className='rounded bg-blue-100 dark:bg-gray-700 px-[0.3rem] py-[0.2rem] font-mono text-sm text-foreground'
                  {...props}
                >
                  {children}
                </code>
              )
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
      <p className='text-sm md:text-base lg:text-lg font-bold mt-8'>Tags:</p>
      <div className='flex flex-wrap gap-2 mt-2 mb-8'>
        {post.tags?.map((tag: string, index: number) => (
          <span
            key={index}
            className='px-2 py-1 text-xs md:text-sm lg:text-base md:px-4 rounded-full bg-foreground text-background'
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
