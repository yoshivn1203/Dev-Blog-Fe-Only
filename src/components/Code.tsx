'use client'

import { CheckIcon } from 'lucide-react'
import { CopyIcon } from 'lucide-react'
import React from 'react'

import { MermaidDiagram } from '@/components/MermaidDiagram'
import { cn } from '@/lib/utils'

import { Button } from './ui/button'

interface CodeProps {
  inline?: boolean
  children?: React.ReactNode
  className?: string
  node?: any
  [key: string]: any
}

export const Code: React.FC<CodeProps> = ({ children = [], className, node, ...props }) => {
  const isMermaid = className && /^language-mermaid/.test(className.toLocaleLowerCase())
  const code = Array.isArray(children) && children.length > 0 ? children[0].toString() : ''

  // Check if this is a code block (has language class) or inline code
  const match = /language-(\w+)/.exec(className || '')
  const isCodeBlock = match && match.length > 0

  // mermaid diagram
  if (isMermaid) {
    return <MermaidDiagram code={code} node={node} />
  }

  // code block
  if (isCodeBlock) {
    const [copied, setCopied] = React.useState(false)
    const codeRef = React.useRef<HTMLElement>(null)

    const handleCopy = () => {
      const codeText = codeRef.current?.textContent || ''
      navigator.clipboard.writeText(codeText)
      setCopied(true)
    }

    return (
      <>
        <div className='bg-gray-800 text-gray-200 px-4 py-2 text-sm flex justify-between items-center'>
          <span>{match[1]}</span>
          <Button variant='ghost' onClick={handleCopy} className=''>
            {copied ? (
              <>
                <CheckIcon /> Copied!
              </>
            ) : (
              <>
                <CopyIcon /> Copy
              </>
            )}
          </Button>
        </div>
        <div className='p-4'>
          <code
            ref={codeRef}
            className={cn(
              '!rounded !p-0 !bg-blue-100 dark:!bg-gray-600 !font-mono !text-sm !text-foreground',
              className
            )}
            {...props}
          >
            {children}
          </code>
        </div>
      </>
    )
  }

  // inline code
  return (
    <code
      className={cn(
        '!rounded !p-1 !bg-blue-100 dark:!bg-gray-600 !font-mono !text-sm !text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}
