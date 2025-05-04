import fs from 'node:fs'
import path from 'node:path'

import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/blog')
const indexPath = path.join(postsDirectory, 'index.json')

const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

const posts = fileNames.map(fileName => {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(fileContents)
  return {
    slug,
    ...data
  }
})

fs.writeFileSync(indexPath, JSON.stringify(posts, null, 2))
console.log('Blog index generated!')
