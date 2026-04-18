'use client'
import React from 'react'

interface RenderOptions {
  sources:       Record<string, { title: string; excerpt: string; url: string }>
  onCiteClick:   (id: string) => void
  highlightedId: string | null
}

export const E4C_SOURCE_ID = 'E4C'

export function renderContent(text: string, opts: RenderOptions): React.ReactNode[] {
  if (!text) return []

  const pattern = /(\[SRC-\d+\]|\[E4C\]|\[ASSUMPTION:[^\]]+\]|\[UNCERTAIN\])/g
  const parts   = text.split(pattern)

  return parts.map((part, i) => {

    // SRC citation — clickable button
    const srcMatch = part.match(/^\[SRC-(\d+)\]$/)
    if (srcMatch) {
      const id  = `SRC-${srcMatch[1].padStart(3, '0')}`
      const src = opts.sources[id]
      const hi  = opts.highlightedId === id
      return (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); opts.onCiteClick(id) }}
          title={src?.title ?? id}
          style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: 'Roboto, system-ui, sans-serif',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            background: hi ? '#00557b' : '#e8f5fb',
            color: hi ? 'white' : '#00557b',
            border: `1px solid ${hi ? '#00557b' : '#5cb1d0'}`,
            borderRadius: '2px', padding: '1px 5px', margin: '0 2px',
            cursor: 'pointer', verticalAlign: 'middle',
            position: 'relative', top: '-1px',
            whiteSpace: 'nowrap', lineHeight: '16px',
          }}
        >
          {id}
        </button>
      )
    }

    // E4C citation — also clickable
    if (part === '[E4C]') {
      const hi = opts.highlightedId === E4C_SOURCE_ID
      return (
        <button
          key={i}
          onClick={(e) => { e.stopPropagation(); opts.onCiteClick(E4C_SOURCE_ID) }}
          title="Engineering For Change knowledge base"
          style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: 'Roboto, system-ui, sans-serif',
            fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            background: hi ? '#1a5c3a' : '#e8f5ee',
            color: hi ? 'white' : '#1a5c3a',
            border: '1px solid #7dc4a0',
            borderRadius: '2px', padding: '1px 5px', margin: '0 2px',
            cursor: 'pointer', verticalAlign: 'middle',
            position: 'relative', top: '-1px',
            whiteSpace: 'nowrap', lineHeight: '16px',
          }}
        >
          E4C
        </button>
      )
    }

    // Assumption flag
    const assumptionMatch = part.match(/^\[ASSUMPTION:(.+)\]$/)
    if (assumptionMatch) {
      return (
        <span key={i} style={{ background: '#fff8e6', borderLeft: '3px solid #e6a817', padding: '2px 8px', fontSize: '0.9em', color: '#7a5010', display: 'inline' }}>
          ⚠ Assumption: {assumptionMatch[1].trim()}
        </span>
      )
    }

    // Uncertain flag
    if (part === '[UNCERTAIN]') {
      return (
        <span key={i} style={{ background: '#f0f4f6', borderLeft: '3px solid #9ab0bc', padding: '2px 8px', color: '#5a7280', display: 'inline' }}>
          ~ Uncertain
        </span>
      )
    }

    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

export function buildSourceMap(sources: Array<{ id: string; title: string; excerpt: string; url: string }>) {
  return Object.fromEntries(sources.map(s => [s.id, s]))
}