'use server'

import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

declare const process: { cwd(): string }
const postsDirectory = path.join(process.cwd(), 'content/blog')

export interface Post {
  slug: string
  title: string
  date: string
  content: string
  category: string
  description: string
  thumbnail?: string
  author: string
  tags?: string[]
  reading_time?: string
}

export async function getPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames.map(fileName => {
    const slug = fileName.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      ...(data as Omit<Post, 'slug'>)
    }
  })

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const decodedSlug = decodeURIComponent(slug)
  const fullPath = path.join(postsDirectory, `${decodedSlug}.md`)

  // Check if file exists before trying to read it
  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: decodedSlug,
    content,
    ...(data as Omit<Post, 'slug' | 'content'>)
  }
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await getPosts()
  const searchQuery = query.toLowerCase()

  return posts.filter(post => post.title.toLowerCase().includes(searchQuery))
}
