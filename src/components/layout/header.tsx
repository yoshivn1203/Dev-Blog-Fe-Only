'use client'

import { Moon, Sun } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import logoImage from '@/assets/images/logo.png'
import { Button } from '@/components/ui/button'
import { RootState } from '@/store/store'
import { toggleTheme } from '@/store/ui/themeSlice'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const scrollToSection = (sectionId: string) => {
    if (pathname !== '/') {
      // If not on home page, just navigate to home with the section hash
      router.push(`/#${sectionId}`)
    } else {
      // If already on home page, scroll to section
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsMenuOpen(false)
      }
    }
  }

  return (
    <>
      <nav className='border-b'>
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
            <div className='flex-1 flex items-center justify-center md:justify-start'>
              <Link href='/' className='flex items-center justify-center w-full md:justify-start'>
                <Image
                  src={logoImage}
                  alt='DN DENTCARE Logo'
                  height={140}
                  width={140}
                  className='object-contain'
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex space-x-4 items-center'>
              <Button
                variant='ghost'
                className='font-semibold'
                onClick={() => scrollToSection('how-it-works')}
              >
                How It Works
              </Button>
              <Button
                variant='ghost'
                className='font-semibold'
                onClick={() => scrollToSection('reviews')}
              >
                Reviews
              </Button>
              <Link href='/about'>
                <Button variant='ghost' className='font-semibold'>
                  About Us
                </Button>
              </Link>
              <Link href='/booking'>
                <Button variant='destructive' className='font-semibold'>
                  CHOOSE YOUR PLAN
                </Button>
              </Link>
              <div className='relative'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => dispatch(toggleTheme())}
                  className='ml-2'
                >
                  {isDark ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
                </Button>
                <div className='bg-foreground text-background py-2 px-4 absolute top-[51px] right-0 z-10 w-[412px]'>
                  Prefer to talk? Call or WhatsApp us{' '}
                  <span className='font-semibold underline'>+84-818-548-409</span>
                </div>
              </div>
            </div>
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
              md:hidden pb-4 space-y-2
            `}
          >
            <Link href='/booking' className='block' onClick={() => setIsMenuOpen(false)}>
              <Button variant='destructive' className='ml-3'>
                Choose Your Plan
              </Button>
            </Link>
            <div className='py-1 ml-3 text-sm'>
              Prefer to talk? Call or WhatsApp us{' '}
              <span className='font-semibold underline'>+84-818-548-409</span>
            </div>

            <Button
              variant='ghost'
              className='w-full justify-start font-semibold'
              onClick={() => scrollToSection('how-it-works')}
            >
              How It Works
            </Button>
            <Button
              variant='ghost'
              className='w-full justify-start font-semibold'
              onClick={() => scrollToSection('reviews')}
            >
              Reviews
            </Button>
            <Link href='/about' onClick={() => setIsMenuOpen(false)}>
              <Button variant='ghost' className='w-full justify-start font-semibold'>
                About
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      {/* <div className='hidden md:block relative'> */}

      {/* </div> */}
    </>
  )
}
