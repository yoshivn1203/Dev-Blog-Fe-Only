import React from 'react'

import { MermaidDiagram } from '@/components/MermaidDiagram'
import { cn } from '@/lib/utils'

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
    return (
      <>
        <div className='bg-gray-800 text-gray-200 px-4 py-2 text-sm'>{match[1]}</div>
        <div className='p-4'>
          <code
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
