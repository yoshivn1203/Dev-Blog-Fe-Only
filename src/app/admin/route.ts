import { readFileSync } from 'fs'
import { NextResponse } from 'next/server'
import { resolve } from 'path'

export async function GET() {
  const adminIndexPath = resolve('./public/admin/index.html')
  const adminHtml = readFileSync(adminIndexPath, 'utf-8')

  return new NextResponse(adminHtml, {
    headers: {
      'Content-Type': 'text/html'
    }
  })
}
