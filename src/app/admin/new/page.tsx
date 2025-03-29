'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import MDEditor from '@uiw/react-md-editor'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  tags: z.string().min(1, 'At least one tag is required'),
  reading_time: z.string().min(1, 'Reading time is required'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.string().min(1, 'Thumbnail is required'),
  description: z.string().min(1, 'Description is required')
})

type FormData = z.infer<typeof formSchema>

export default function NewPost() {
  const router = useRouter()
  const [value, setValue] = React.useState<string | undefined>('**Hello world!!!**')
  const [isUploading, setIsUploading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue: setFormValue,
    watch,
    trigger
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  })

  const thumbnail = watch('thumbnail')

  const uploadImage = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.url
  }

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items
    const item = items?.[0]

    if (item?.type.indexOf('image') === 0) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        try {
          const imageUrl = await uploadImage(file)
          const imageMarkdown = `![image](${imageUrl})\n`
          setValue(prev => (prev ? prev + imageMarkdown : imageMarkdown))
        } catch (error) {
          console.error('Error uploading pasted image:', error)
          alert('Failed to upload pasted image')
        }
      }
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      setFormValue('thumbnail', imageUrl)
      trigger('thumbnail')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const generateFilename = (title: string) => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    // Convert title to URL-friendly format
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    return `${year}-${month}-${day}-${slug}`
  }

  const onSubmit = async (data: FormData) => {
    try {
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

      const filename = generateFilename(data.title)
      const response = await fetch('/api/save-markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: frontmatter + value,
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

  return (
    <div data-color-mode='light' className='mb-10'>
      <div className='flex items-center gap-2'>
        <Button
          variant='ghost'
          onClick={() => router.push('/admin')}
          className='pl-0 hover:bg-transparent hover:opacity-80 text-blue-600'
        >
          <ArrowLeft className='mr-2 h-4 w-4' />
          Back to Dashboard
        </Button>
      </div>

      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-bold mt-4'>Creating New Post</h1>
        <Button
          variant='outline'
          onClick={handleSubmit(onSubmit)}
          className='bg-gradient-to-r hover:text-white from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white border-0'
        >
          Publish Post
        </Button>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-8'
      >
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input id='title' {...register('title')} placeholder='Enter title' />
            {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='author'>Author *</Label>
            <Input id='author' {...register('author')} placeholder='Enter author name' />
            {errors.author && <p className='text-sm text-red-500'>{errors.author.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='tags'>Tags * (comma-separated)</Label>
            <Input id='tags' {...register('tags')} placeholder='e.g., Cloud, DevOps, Security' />
            {errors.tags && <p className='text-sm text-red-500'>{errors.tags.message}</p>}
          </div>
        </div>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='reading_time'>Reading Time (minutes) *</Label>
            <Input
              id='reading_time'
              type='number'
              {...register('reading_time')}
              placeholder='Enter reading time'
            />
            {errors.reading_time && (
              <p className='text-sm text-red-500'>{errors.reading_time.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='category'>Category *</Label>
            <Input id='category' {...register('category')} placeholder='Enter category' />
            {errors.category && <p className='text-sm text-red-500'>{errors.category.message}</p>}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='thumbnail'>Thumbnail *</Label>
            <div className='flex gap-2'>
              <Input
                id='thumbnail'
                {...register('thumbnail')}
                placeholder='e.g., /images/uploads/example.png'
                readOnly
              />
              <div className='relative'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageUpload}
                  className='hidden'
                  id='thumbnail-upload'
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => document.getElementById('thumbnail-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
            {errors.thumbnail && <p className='text-sm text-red-500'>{errors.thumbnail.message}</p>}
            {thumbnail && (
              <div className='mt-2'>
                <img
                  src={thumbnail}
                  alt='Thumbnail preview'
                  className='max-w-xs rounded-lg shadow-sm'
                />
              </div>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description *</Label>
            <Input id='description' {...register('description')} placeholder='Enter description' />
            {errors.description && (
              <p className='text-sm text-red-500'>{errors.description.message}</p>
            )}
          </div>
        </div>
      </form>
      <MDEditor value={value} onChange={setValue} onPaste={handlePaste} height={640} />
    </div>
  )
}
