// Remove 'use client' since we want this to be a Server Component
import { Code } from 'lucide-react'

import { getPosts } from './actions'
import { BlogCard } from './blog-card'

export default async function BlogPage() {
  // Fetch posts directly in the Server Component
  const posts = await getPosts()

  return (
    <div className='container mx-auto p-6 sm:mt-12'>
      {/* Welcome Section */}
      <div className='mb-12 p-8 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20'>
        <div className='flex items-center gap-4 mb-4'>
          <div className='flex text-indigo-500 dark:text-indigo-400'>
            <Code className='w-8 h-8 -ml-2' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
            Welcome!
          </h1>
        </div>
        <p className='text-base md:text-lg text-gray-700 dark:text-gray-300'>
          Hey there, welcome to my developer blog—straight from my brain to you, where I dump
          everything I'm learning as I go!
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
