// Remove 'use client' since we want this to be a Server Component
import { getPosts } from './actions'
import { BlogCard } from './blog-card'

export default async function BlogPage() {
  // Fetch posts directly in the Server Component
  const posts = await getPosts()

  return (
    <div className='container mx-auto p-6 sm:mt-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
