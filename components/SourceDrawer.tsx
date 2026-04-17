'use client'
import { Source } from '@/lib/api'

interface Props {
  source:  Source | null
  isOpen:  boolean
  onClose: () => void
}

const SOURCE_LABELS: Record<string, string> = {
  e4c:        'Engineering For Change',
  world_bank: 'World Bank Open Data',
  who:        'WHO Global Health Observatory',
}
const SOURCE_COLORS: Record<string, string> = {
  e4c:        '#00557b',
  world_bank: '#1a6b3a',
  who:        '#7b4000',
}

export default function SourceDrawer({ source, isOpen, onClose }: Props) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/10 z-40" onClick={onClose} />}

      <aside className={`source-drawer ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ background: '#1a3a4a', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5cb1d0' }}>
            Source Reference
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ab0bc', cursor: 'pointer', fontSize: '16px', lineHeight: 1 }}>
            ✕
          </button>
        </div>

        {source ? (
          <div style={{ padding: '20px' }}>
            {/* Type badge */}
            <div style={{
              display: 'inline-block',
              background: '#e8f5fb',
              color: SOURCE_COLORS[source.source_type] ?? '#00557b',
              fontFamily: 'Roboto, system-ui, sans-serif',
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              marginBottom: '12px',
            }}>
              {SOURCE_LABELS[source.source_type] ?? source.source_type}
            </div>

            {/* ID */}
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#9ab0bc', marginBottom: '10px' }}>
              {source.id}
            </div>

            {/* Title */}
            <h3 style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontWeight: 700, fontSize: '15px', color: '#00557b', lineHeight: 1.4, marginBottom: '12px' }}>
              {source.title}
            </h3>

            {/* Excerpt */}
            {source.excerpt && (
              <div style={{ borderLeft: '3px solid #5cb1d0', paddingLeft: '12px', marginBottom: '16px' }}>
                <p style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontSize: '13px', color: '#5a7280', lineHeight: 1.6, fontStyle: 'italic' }}>
                  {source.excerpt}
                </p>
              </div>
            )}

            {/* Link */}
            {source.url && (
              <a href={source.url} target="_blank" rel="noopener" style={{
                fontFamily: 'Roboto, system-ui, sans-serif',
                fontSize: '12px',
                fontWeight: 700,
                color: '#00557b',
                textDecoration: 'underline',
                textDecorationStyle: 'dotted',
                display: 'block',
                marginBottom: '20px',
              }}>
                View original source ↗
              </a>
            )}

            {/* Responsible AI note */}
            <div style={{ borderTop: '1px solid #e8eef1', paddingTop: '14px', fontFamily: 'Roboto, system-ui, sans-serif', fontSize: '11px', color: '#9ab0bc', lineHeight: 1.6 }}>
              Retrieved from {source.source_type === 'e4c' ? 'E4C knowledge base via KnowledgeXpert' : 'public open data'}. All claims trace to registered sources.
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', fontFamily: 'Roboto, system-ui, sans-serif', fontSize: '13px', color: '#9ab0bc' }}>
            Click any citation tag to view its source.
          </div>
        )}
      </aside>
    </>
  )
}
