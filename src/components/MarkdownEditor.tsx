'use client'

import MDEditor from '@uiw/react-md-editor'
import React from 'react'

import { Code } from './Code'

interface MarkdownEditorProps {
  value: string | undefined
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string | undefined) => void
  isDark: boolean
}

export function MarkdownEditor({ value, onChange, isDark }: MarkdownEditorProps) {
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

          // Find the MDEditor's textarea element using its specific class
          const textarea = document.querySelector('.w-md-editor-text-input')
          if (textarea instanceof HTMLTextAreaElement) {
            // Get current cursor position
            const { selectionStart, selectionEnd } = textarea
            const currentValue = value || ''

            // Insert the image markdown at cursor position
            const newValue =
              currentValue.substring(0, selectionStart) +
              imageMarkdown +
              currentValue.substring(selectionEnd)

            onChange(newValue)
          } else {
            // Fallback: if textarea not found, append to end
            onChange(value ? value + imageMarkdown : imageMarkdown)
          }
        } catch (error) {
          console.error('Error uploading pasted image:', error)
          alert('Failed to upload pasted image')
        }
      }
    }
  }

  return (
    <div data-color-mode={isDark ? 'dark' : 'light'}>
      <MDEditor
        value={value}
        onChange={onChange}
        onPaste={handlePaste}
        height={640}
        previewOptions={{
          components: {
            h1: ({ ...props }) => (
              <h1 className='text-3xl font-bold mt-8 mb-4 border-b-1 border-gray-200' {...props} />
            ),
            h2: ({ ...props }) => (
              <div
                className='text-2xl font-bold mt-6 mb-4 !border-b-2 !border-gray-200'
                {...props}
              />
            ),
            iframe: ({ ...props }) => (
              <div className='relative w-full aspect-video'>
                <iframe {...props} className='absolute inset-0 w-full h-full' />
              </div>
            ),
            //code block (```) and mermaid diagram has a pre tag as parent
            pre: ({ children, ...props }) => (
              <pre className='!bg-blue-100 dark:!bg-gray-600 !p-0 rounded-lg' {...props}>
                {children}
              </pre>
            ),
            //this is code for both inline and block code
            code: Code
          }
        }}
      />
    </div>
  )
}
