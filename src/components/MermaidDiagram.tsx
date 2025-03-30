'use client'

import mermaid from 'mermaid'
import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { getCodeString } from 'rehype-rewrite'

// Initialize mermaid
mermaid.initialize({ startOnLoad: true })

const randomid = () => parseInt(String(Math.random() * 1e15), 10).toString(36)

interface MermaidDiagramProps {
  code: string
  node?: any
}

export function MermaidDiagram({ code, node }: MermaidDiagramProps) {
  const demoid = useRef(`dome${randomid()}`)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const mermaidCode = node ? getCodeString(node.children) : code

  useEffect(() => {
    if (container && demoid.current && mermaidCode) {
      mermaid
        .render(demoid.current, mermaidCode)
        .then(({ svg, bindFunctions }) => {
          container.innerHTML = svg
          if (bindFunctions) {
            bindFunctions(container)
          }
        })
        .catch((error: Error) => {
          console.log('error:', error)
        })
    }
  }, [container, mermaidCode])

  const refElement = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setContainer(node)
    }
  }, [])

  return (
    <Fragment>
      <code id={demoid.current} style={{ display: 'none' }} />
      <code ref={refElement} data-name='mermaid' />
    </Fragment>
  )
}
