/// <reference types="node" />

import { notFound } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Only allow access on localhost
    if (!request.nextUrl.hostname.includes('localhost')) {
      notFound()
    }
  }

  return NextResponse.next()
}
