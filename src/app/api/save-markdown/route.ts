/// <reference types="node" />
import { unlink, writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { content, filename, oldSlug } = await request.json()

    if (!content || !filename) {
      return NextResponse.json({ error: 'Content and filename are required' }, { status: 400 })
    }

    const blogDir = path.resolve('content', 'blog')
    const filePath = path.join(blogDir, filename)

    // If this is an update and the old file exists, delete it
    if (oldSlug) {
      const oldFilePath = path.join(blogDir, `${oldSlug}.md`)
      try {
        await unlink(oldFilePath)
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }

    // Write the new file
    await writeFile(filePath, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
  }
}
