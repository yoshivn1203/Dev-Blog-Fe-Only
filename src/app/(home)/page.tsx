import Link from 'next/link'

import { Hero } from '@/components/layout/hero'

import { getPaginatedPosts } from './actions'
import { BlogCard } from './blog-card'

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 10
  const { posts, total } = await getPaginatedPosts(page, pageSize)
  const totalPages = Math.ceil(total / pageSize)

  return (
    <>
      <Hero showWelcome={true} />
      <div className='relative container mx-auto p-2 md:p-6 max-w-6xl mt-[-80px] md:mt-[-100px]'>
        <p className='text-base md:text-lg font-bold text-left'>Latest posts</p>
        <div className='h-[1px] w-full bg-gray-200 dark:bg-gray-700 mb-6'></div>
        <div className='flex flex-col gap-6'>
          {posts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} />
      </div>
    </>
  )
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  // Show up to 5 page numbers, centered on current page
  const pageNumbers = []
  const minPage = Math.max(1, page - 2)
  const maxPage = Math.min(totalPages, page + 2)
  for (let i = minPage; i <= maxPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className='flex items-center justify-center gap-2 mt-8'>
      <Link
        href={`?page=${page - 1}`}
        className={`px-3 py-1 rounded border ${page === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-disabled={page === 1}
        tabIndex={page === 1 ? -1 : 0}
      >
        Previous
      </Link>
      {minPage > 1 && <span className='px-2'>...</span>}
      {pageNumbers.map(num => (
        <Link
          key={num}
          href={`?page=${num}`}
          className={`px-3 py-1 rounded border ${num === page ? 'bg-blue-500 text-white border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          aria-current={num === page ? 'page' : undefined}
        >
          {num}
        </Link>
      ))}
      {maxPage < totalPages && <span className='px-2'>...</span>}
      <Link
        href={`?page=${page + 1}`}
        className={`px-3 py-1 rounded border ${page === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        aria-disabled={page === totalPages}
        tabIndex={page === totalPages ? -1 : 0}
      >
        Next
      </Link>
    </nav>
  )
}
