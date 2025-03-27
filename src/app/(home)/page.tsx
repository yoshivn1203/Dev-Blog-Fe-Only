'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { type Post, getPosts } from './actions'
import { BlogCard } from './blog-card'

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>(['All'])

  useEffect(() => {
    getPosts().then(posts => {
      setPosts(posts)
      setCategories(['All', ...new Set(posts.map(post => post.category))])
    })
  }, [])

  const filteredPosts =
    activeCategory === 'All' ? posts : posts.filter(post => post.category === activeCategory)

  return (
    <div className='container mx-auto p-6 sm:mt-12'>
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-6'>Blog Posts</h1>
        <div className='flex flex-wrap gap-2'>
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              size='sm'
              className='capitalize font-bold'
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredPosts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
