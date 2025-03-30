'use client'

import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'

import { FormData, PostForm } from '@/components/PostForm'
import { RootState } from '@/store/store'
import { generateFilename } from '@/utils/post'

export default function NewPost() {
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const router = useRouter()

  const handleSubmit = async (data: FormData, content?: string) => {
    try {
      const filename = generateFilename(data.title)
      const currentDate = new Date()
      const formattedDate = currentDate.toISOString().replace(/\.\d{3}Z$/, '')
      const frontmatter = `---
layout: blog
title: "${data.title}"
date: ${formattedDate}
author: ${data.author}
tags:
${data.tags
  .split(',')
  .map(tag => `  - ${tag.trim()}`)
  .join('\n')}
reading_time: ${data.reading_time}
category: ${data.category}
thumbnail: ${data.thumbnail}
description: "${data.description}"
---\n\n`

      const response = await fetch('/api/save-markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: frontmatter + content,
          filename: `${filename}.md`
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save file')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Error saving file:', error)
      alert('Failed to save file')
    }
  }

  return <PostForm onSubmit={handleSubmit} isDark={isDark} />
}
