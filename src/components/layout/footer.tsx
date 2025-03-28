'use client'

import { Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import logoImage from '@/assets/images/logo.svg'

export function Footer() {
  return (
    <footer className='shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] dark:bg-gray-800 border-t mt-8'>
      <div className='mx-auto max-w-screen-2xl px-4 pt-8 pb-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row items-start justify-between gap-8'>
          <div className='sm:justify-start lg:max-w-sm'>
            <Link href='/'>
              <Image
                src={logoImage}
                alt='DN DENTCARE Logo'
                height={160}
                width={160}
                className='object-contain'
              />
            </Link>
            <p className='text-sm text-muted-foreground'>
              A community-driven platform for programming knowledge exchange. Share experiences,
              learn from others, and grow together as developers.
            </p>
          </div>

          {/* Quick Links */}
          <div className='grid gap-8 grid-cols-1 sm:grid-cols-3 w-full lg:w-auto'>
            <div>
              <p className='font-bold'>Resources</p>
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
              <p className='font-bold'>Social</p>
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
              <p className='font-bold'>Contact</p>
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

      <div className='mt-12 border-t pt-2 pb-2'>
        <div className='text-center text-sm text-muted-foreground'>
          <p>© 2024 BoBytes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
