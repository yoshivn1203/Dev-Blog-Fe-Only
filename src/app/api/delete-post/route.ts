/// <reference types="node" />

import fs from 'node:fs'
import path from 'node:path'

import { NextResponse } from 'next/server'

declare const process: { cwd(): string }

export async function POST(request: Request) {
  try {
    const { slug } = await request.json()
    const postsDirectory = path.join(process.cwd(), 'content/blog')
    const filePath = path.join(postsDirectory, `${slug}.md`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    fs.unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
