/// <reference types="node" />
import fs from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { content, filename } = await request.json()

    if (!content || !filename) {
      return NextResponse.json({ error: 'Content and filename are required' }, { status: 400 })
    }

    const blogDir = path.resolve('content', 'blog')
    const filePath = path.join(blogDir, filename)

    // Ensure the blog directory exists
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true })
    }

    // Write the file
    fs.writeFileSync(filePath, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}
