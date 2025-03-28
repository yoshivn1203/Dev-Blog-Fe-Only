// Remove 'use client' since we want this to be a Server Component

import { Hero } from '@/components/layout/hero'

import { getPosts } from './actions'
import { BlogCard } from './blog-card'
export default async function BlogPage() {
  // Fetch posts directly in the Server Component
  const posts = await getPosts()

  return (
    <>
      <Hero />
      <div className='container mx-auto p-2 md:p-6 max-w-6xl'>
        <p className='text-lg font-bold'>Latest posts</p>
        <div className='h-[1px] w-full bg-gray-200 dark:bg-gray-700 mb-6'></div>
        <div className='flex flex-col gap-6'>
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  )
}
