'use client'
import React from 'react'

interface RenderOptions {
  sources:       Record<string, { title: string; excerpt: string; url: string }>
  onCiteClick:   (id: string) => void
  highlightedId: string | null
}

/**
 * Parse a content string and return React nodes with inline citation chips,
 * assumption flags, and uncertainty highlights.
 */
export function renderContent(text: string, opts: RenderOptions): React.ReactNode[] {
  if (!text) return []

  // Combined pattern: [SRC-###], [E4C], [ASSUMPTION: ...], [UNCERTAIN]
  const pattern = /(\[SRC-\d{3}\]|\[E4C\]|\[ASSUMPTION:[^\]]+\]|\[UNCERTAIN\])/g
  const parts   = text.split(pattern)

  return parts.map((part, i) => {
    // SRC citation
    const srcMatch = part.match(/^\[SRC-(\d{3})\]$/)
    if (srcMatch) {
      const id  = `SRC-${srcMatch[1]}`
      const src = opts.sources[id]
      return (
        <button
          key={i}
          className={`cite-tag ${opts.highlightedId === id ? 'ring-2 ring-e4c-green' : ''}`}
          onClick={() => opts.onCiteClick(id)}
          title={src?.title ?? id}
          aria-label={`View source: ${src?.title ?? id}`}
        >
          {id}
        </button>
      )
    }

    // E4C citation
    if (part === '[E4C]') {
      return (
        <span key={i} className="cite-tag e4c" title="Engineering For Change knowledge base">
          E4C
        </span>
      )
    }

    // Assumption flag
    const assumptionMatch = part.match(/^\[ASSUMPTION:(.+)\]$/)
    if (assumptionMatch) {
      return (
        <span key={i} className="flag-assumption">
          ⚠ Assumption: {assumptionMatch[1].trim()}
        </span>
      )
    }

    // Uncertain flag
    if (part === '[UNCERTAIN]') {
      return (
        <span key={i} className="flag-uncertain">
          ~ Uncertain
        </span>
      )
    }

    // Plain text — split on newlines to preserve paragraphs
    return <React.Fragment key={i}>{part}</React.Fragment>
  })
}

/** Build a lookup map from sources array */
export function buildSourceMap(sources: Array<{ id: string; title: string; excerpt: string; url: string }>) {
  return Object.fromEntries(sources.map(s => [s.id, s]))
}
