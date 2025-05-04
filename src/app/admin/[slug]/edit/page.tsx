'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'

import { getPostBySlug } from '@/app/(home)/actions'
import { FormData, PostForm } from '@/components/PostForm'
import { RootState } from '@/store/store'
import { generateFilename } from '@/utils/post'

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params)
  const isDark = useSelector((state: RootState) => state.theme.isDark)
  const router = useRouter()
  const [post, setPost] = React.useState<Awaited<ReturnType<typeof getPostBySlug>> | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await getPostBySlug(resolvedParams.slug)
        setPost(postData)
      } catch (error) {
        console.error('Error loading post:', error)
        alert('Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }
    loadPost()
  }, [resolvedParams.slug])

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
          filename: `${filename}.md`,
          oldSlug: resolvedParams.slug
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save file')
      }

      // Update the blog index after successful edit
      const indexResponse = await fetch('/api/generate-index', {
        method: 'POST'
      })

      if (!indexResponse.ok) {
        throw new Error('Failed to update index')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to save file')
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-[50vh]'>
        <Loader2 className='animate-spin' />
      </div>
    )
  }

  return <PostForm initialData={post} onSubmit={handleSubmit} isDark={isDark} />
}
