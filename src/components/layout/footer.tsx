'use client'

import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import logoImage from '@/assets/images/logo.svg'

export function Footer() {
  return (
    <footer className='bg-gray-50 dark:bg-gray-800 border-t'>
      <div className='mx-auto max-w-screen-2xl px-4 pt-8 pb-4 sm:px-6 lg:px-8'>
        <div className='lg:flex lg:items-center lg:justify-between '>
          <div className='sm:justify-start mb-8 md:mb-16'>
            <Link href='/' className='flex items-center'>
              <Image
                src={logoImage}
                alt='DN DENTCARE Logo'
                height={160}
                width={160}
                className='object-contain'
              />
            </Link>
            <p className=' w-[100%] md:w-2/3 text-sm text-muted-foreground'>
              A community-driven platform for programming knowledge exchange. Share experiences,
              learn from others, and grow together as developers.
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Quick Links */}
            <div className='grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3'>
              <div>
                <p className='font-medium'>Resources</p>
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
                <p className='font-medium'>Social</p>
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
                <p className='font-medium'>Contact</p>
                <nav className='mt-4 flex flex-col space-y-2 text-sm text-muted-foreground'>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    <span>+84-818-548-409</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    <span>khainguyen1203@gmail.com</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <MapPin className='h-4 w-4' />
                    <span>Da Nang, Vietnam</span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-12 border-t pt-4'>
          <div className='text-center text-sm text-muted-foreground'>
            <p>© 2024 BoBytes. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
