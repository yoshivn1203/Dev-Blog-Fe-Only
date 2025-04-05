'use client'

import { Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSelector } from 'react-redux'

import logoImage from '@/assets/images/logo.png'
import logoImageDark from '@/assets/images/logo-dark.png'
import { RootState } from '@/store/store'

export function Footer() {
  const isDark = useSelector((state: RootState) => state.theme.isDark)

  return (
    <footer className='shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] mt-8 px-4 pt-8 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800  '>
      <div className='mx-auto max-w-screen-2xl '>
        <div className='flex flex-col lg:flex-row items-start justify-between gap-8'>
          <div className='sm:justify-start lg:max-w-sm'>
            <Link href='/'>
              <Image
                src={isDark ? logoImageDark : logoImage}
                alt='DN DENTCARE Logo'
                height={200}
                width={200}
                className='object-contain'
              />
            </Link>
            <p className='text-sm text-muted-foreground mt-6'>
              Welcome to my personal developer blog, where I share my thoughts, experiences, and
              lessons learned as I explore the world of software development. Whether you're here to
              learn or just curious about my projects, I hope you find something useful!
            </p>
          </div>

          {/* Quick Links */}
          <div className='grid gap-8 grid-cols-1 sm:grid-cols-3 w-full lg:w-auto'>
            <div>
              <p className='font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
                Resources
              </p>
              <nav className='mt-4 flex flex-col space-y-2 text-sm text-muted-foreground'>
                <Link href='/' className='hover:opacity-75'>
                  Tutorials
                </Link>
                <Link href='/' className='hover:opacity-75'>
                  Blogs
                </Link>
                <Link href='/' className='hover:opacity-75'>
                  About Us
                </Link>
              </nav>
            </div>

            <div>
              <p className='font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
                Social
              </p>
              <nav className='mt-4 flex flex-col space-y-2 text-sm text-muted-foreground'>
                <Link href='/' className='hover:opacity-75'>
                  Github
                </Link>
                <Link href='/' className='hover:opacity-75'>
                  LinkedIn
                </Link>
                <Link href='/' className='hover:opacity-75'>
                  Twitter
                </Link>
              </nav>
            </div>

            <div>
              <p className='font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
                Contact
              </p>
              <nav className='mt-4 flex flex-col space-y-2 text-sm text-muted-foreground'>
                {/* <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    <span>+84-818-548-409</span>
                  </div> */}
                <div className='flex items-start gap-2'>
                  <Mail className='h-4 w-4 flex-shrink-0 mt-1' />
                  <span className='break-all'>khainguyen1203@gmail.com</span>
                </div>
                <div className='flex items-start gap-2'>
                  <MapPin className='h-4 w-4 flex-shrink-0 mt-1' />
                  <span className='break-words'>Da Nang, Vietnam</span>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12 max-w-screen-2xl mx-auto border-t pt-4 pb-4 border-gray-300 dark:border-white/10'>
        <div className='text-sm text-muted-foreground'>
          <p>© 2024 BoBytes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
