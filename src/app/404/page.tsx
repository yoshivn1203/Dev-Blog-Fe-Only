import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-lg text-gray-600 mb-8 text-center max-w-md'>
        The admin dashboard is only available in development environment. This page is not
        accessible in production.
      </p>
      <Link href='/' className='text-blue-500 hover:text-blue-700 underline'>
        Return to Home
      </Link>
    </div>
  )
}
