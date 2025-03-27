import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw' // ✅ Allow raw HTML
import remarkGfm from 'remark-gfm'

import { getPostBySlug } from '../actions'

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug } = resolvedParams
  const post = await getPostBySlug(slug)

  return (
    <article className='container mx-auto p-6 sm:mt-12'>
      <div className='prose prose-lg dark:prose-invert max-w-none'>
        <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>
        <div className='mb-8'>
          <time className='text-muted-foreground'>{new Date(post.date).toLocaleDateString()}</time>
        </div>
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className='w-full h-[240px] sm:h-[480px] object-cover rounded-lg mb-8'
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
            )
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}
