'use client'

import debounce from 'lodash/debounce'
import { Loader2, Moon, Search, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Post, searchPosts } from '@/app/(home)/actions'
import logoImage from '@/assets/images/logo.svg'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { toggleTheme } from '@/store/ui/themeSlice'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const dispatch = useDispatch()

  // Create a debounced search function
  const debouncedSearch = useCallback((query: string) => {
    if (query.length > 2) {
      setIsSearching(true)
      searchPosts(query).then(results => {
        setSearchResults(results)
        setIsSearching(false)
      })
    } else {
      setSearchResults([])
    }
  }, [])

  const debouncedSearchWithDelay = useMemo(() => debounce(debouncedSearch, 300), [debouncedSearch])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearchWithDelay(query)
  }

  return (
    <nav className='absolute w-full border-b border-gray-200/20 dark:border-gray-600/20 bg-transparent backdrop-blur-sm z-50 shadow-md'>
      <div className='mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between h-16 items-center'>
          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button variant='ghost' onClick={() => setIsMenuOpen(!isMenuOpen)} className='p-2'>
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                {isMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </Button>
          </div>

          {/* Logo */}
          <div className='flex-shrink-0 flex items-center justify-center md:justify-start'>
            <Link href='/' className='flex items-center justify-center md:justify-start'>
              <Image
                src={logoImage}
                alt='DN DENTCARE Logo'
                height={100}
                width={100}
                className='object-contain'
              />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 justify-start md:ml-6 lg:ml-12 px-4 relative'>
            <div className='w-[400px] relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={handleSearch}
                placeholder='Search posts...'
                className='w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              />
              {isSearching ? (
                <Loader2 className='absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin' />
              ) : (
                <Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
              )}

              {/* Search Results Dropdown */}
              {searchQuery.length > 2 && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto z-50'>
                  {isSearching ? (
                    <div className='px-4 py-2 text-gray-500 dark:text-gray-400'>Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(post => (
                      <Link
                        key={post.slug}
                        href={`/${post.slug}`}
                        onClick={() => {
                          setSearchQuery('')
                          setSearchResults([])
                        }}
                        className='block text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                      >
                        {post.title}
                      </Link>
                    ))
                  ) : (
                    <div className='px-4 py-2 text-gray-500 dark:text-gray-400'>
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Theme toggle for mobile */}
          <div className='md:hidden'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => dispatch(toggleTheme())}
              className='p-2'
            >
              {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex space-x-4 items-center'>
            {/* <Button variant='ghost' className='font-semibold'>
                How It Works
              </Button>
              <Button variant='ghost' className='font-semibold'>
                Reviews
              </Button> */}
            <Link href='/' onClick={() => setIsMenuOpen(false)}>
              <Button
                variant='ghost'
                className='w-full justify-start font-semibold hover:bg-transparent'
              >
                Home
              </Button>
            </Link>
            <Link href='/'>
              <Button
                variant='ghost'
                className='font-semibold hover:bg-transparent hover:opacity-80'
              >
                About Us
              </Button>
            </Link>
            {/* <Link href='/'>
                <Button variant='destructive' className='font-semibold'>
                  ACTION BUTTON
                </Button>
              </Link> */}
            <div className='relative'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => dispatch(toggleTheme())}
                className='ml-2 hover:bg-transparent hover:opacity-80'
              >
                {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className='md:hidden pb-4'>
          <div className='relative'>
            <input
              type='text'
              value={searchQuery}
              onChange={handleSearch}
              placeholder='Search posts...'
              className='w-full text-sm px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
            {isSearching ? (
              <Loader2 className='absolute right-3 top-2.5 h-5 w-5 text-gray-400 animate-spin' />
            ) : (
              <Search className='absolute right-3 top-2.5 h-5 w-5 text-gray-400' />
            )}
          </div>

          {/* Mobile Search Results */}
          {searchQuery.length > 2 && (
            <div className='mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto'>
              {isSearching ? (
                <div className='text-sm px-4 py-2 text-gray-500 dark:text-gray-400'>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map(post => (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    onClick={() => {
                      setSearchQuery('')
                      setSearchResults([])
                      setIsMenuOpen(false)
                    }}
                    className='block text-sm px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700'
                  >
                    {post.title}
                  </Link>
                ))
              ) : (
                <div className='text-sm px-4 py-2 text-gray-500 dark:text-gray-400'>
                  No results found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div
          className={`
              transform transition-all duration-300 ease-in-out
              absolute left-0 right-0 bg-background
              ${
                isMenuOpen
                  ? 'opacity-100 translate-y-0 z-50'
                  : 'opacity-0 -translate-y-2 pointer-events-none -z-10'
              }
              md:hidden pb-4 
            `}
        >
          {/* <Link href='/booking' className='block' onClick={() => setIsMenuOpen(false)}>
              <Button variant='destructive' className='ml-3'>
                ACTION BUTTON
              </Button>
            </Link> */}
          {/* <Link href='/' onClick={() => setIsMenuOpen(false)}>
              <Button variant='ghost' className='w-full justify-start font-semibold'>
                How It Works
              </Button>
            </Link>
            <Link href='/' onClick={() => setIsMenuOpen(false)}></Link>
            <Button variant='ghost' className='w-full justify-start font-semibold'>
              Reviews
            </Button> */}
          <Link href='/' onClick={() => setIsMenuOpen(false)}>
            <Button
              variant='ghost'
              className='w-full justify-start font-semibold hover:bg-transparent'
            >
              Home
            </Button>
          </Link>
          <Link href='/' onClick={() => setIsMenuOpen(false)}>
            <Button
              variant='ghost'
              className='w-full justify-start font-semibold hover:bg-transparent'
            >
              About Us
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
