import { Code } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <div className='relative h-[280px]'>
      {/* Background Image */}
      <div className='absolute inset-0 z-0'>
        {/* Light mode banner */}
        <Image
          src='/images/uploads/banner-light.jpg'
          alt='Hero background'
          fill
          className='object-cover dark:hidden'
          priority
        />
        {/* Dark mode banner */}
        <Image
          src='/images/uploads/banner.jpg'
          alt='Hero background'
          fill
          className='hidden object-cover dark:block'
          priority
        />
        {/* Dark overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-white dark:from-black/20 dark:via-black/60 dark:to-[#202020]' />
      </div>

      {/* Welcome Content */}
      <div className='relative z-10 pt-32 px-4 sm:px-6 lg:px-8 text-center'>
        <div className='flex items-center gap-4 mb-4 justify-center'>
          <div className='flex text-indigo-500 dark:text-indigo-400 '>
            <Code className='w-8 h-8 -ml-2' />
          </div>
          <h1 className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text'>
            Welcome!
          </h1>
        </div>
        <p className='text-sm md:text-lg text-gray-700 dark:text-gray-300'>
          Hey there, welcome to my developer blog—straight from my brain to you, where I dump
          everything I'm learning as I go!
        </p>
      </div>
    </div>
  )
}
