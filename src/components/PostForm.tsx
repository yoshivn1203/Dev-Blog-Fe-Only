'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { MarkdownEditor } from '@/components/MarkdownEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  tags: z.string().min(1, 'At least one tag is required'),
  reading_time: z.coerce.number().min(1, 'Reading time must be at least 1 minute'),
  category: z.string().min(1, 'Category is required'),
  thumbnail: z.string().min(1, 'Thumbnail is required'),
  description: z.string().min(1, 'Description is required')
})

export type FormData = z.infer<typeof formSchema>

interface PostFormProps {
  initialData?: {
    content?: string | null
    title?: string | null
    author?: string | null
    tags?: string[] | null
    reading_time?: string | number | null
    category?: string | null
    thumbnail?: string | null
    description?: string | null
  } | null
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: FormData, content?: string) => Promise<void>
  isDark: boolean
}

export function PostForm({ initialData, onSubmit, isDark }: PostFormProps) {
  const [value, setValue] = React.useState<string | undefined>(
    initialData?.content || '**Hello world!!!**'
  )
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

  React.useEffect(() => {
    if (initialData) {
      setValue(initialData.content || '')
      setFormValue('title', initialData.title || '')
      setFormValue('author', initialData.author || '')
      setFormValue('tags', initialData.tags?.join(', ') || '')
      setFormValue('reading_time', parseInt(String(initialData.reading_time)) || 0)
      setFormValue('category', initialData.category || '')
      setFormValue('thumbnail', initialData.thumbnail || '')
      setFormValue('description', initialData.description || '')
    } else {
      setFormValue('author', 'Nguyen Nguyen')
      setFormValue('category', 'Technology')
      setFormValue('reading_time', 10)
    }
  }, [initialData, setFormValue])

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

  const handleFormSubmit = async (data: FormData) => {
    await onSubmit(data, value)
  }

  return (
    <div className='mb-10'>
      <div className='flex items-center'>
        <Link href='/admin'>
          <Button
            variant='ghost'
            className='pl-0 text-base text-blue-600 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-transparent hover:opacity-80'
          >
            <ArrowLeft className='h-4 w-4' />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className='flex justify-between items-center border-b border-gray-300 dark:border-gray-700 pb-2'>
        <h1 className='text-xl font-bold mt-4'>
          {initialData ? 'Editing Post' : 'Creating New Post'}
        </h1>
        <Button
          variant='outline'
          onClick={handleSubmit(handleFormSubmit)}
          className='bg-gradient-to-r hover:text-white from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white border-0'
        >
          {initialData ? 'Update Post' : 'Publish Post'}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
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
            <Label htmlFor='description'>Description *</Label>
            <Input id='description' {...register('description')} placeholder='Enter description' />
            {errors.description && (
              <p className='text-sm text-red-500'>{errors.description.message}</p>
            )}
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
              <div className='mt-16'>
                <img
                  src={thumbnail}
                  alt='Thumbnail preview'
                  className='max-w-xs rounded-lg shadow-sm'
                />
              </div>
            )}
          </div>
        </div>
      </form>
      <MarkdownEditor value={value} onChange={setValue} isDark={isDark} />
    </div>
  )
}
