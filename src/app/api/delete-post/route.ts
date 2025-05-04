/// <reference types="node" />

import fs from 'node:fs'
import path from 'node:path'

import { exec } from 'child_process'
import { NextResponse } from 'next/server'
import { promisify } from 'util'

const execAsync = promisify(exec)

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

    // Update the blog index after successful deletion
    await execAsync('node scripts/generateBlogIndex.js')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
