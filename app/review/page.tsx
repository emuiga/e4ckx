'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SynthesizeResponse, Source } from '@/lib/api'
import { renderContent, buildSourceMap } from '@/lib/renderContent'
import Navbar from '@/components/Navbar'
import SourceDrawer from '@/components/SourceDrawer'

type Status = 'pending' | 'approved' | 'flagged'
const R = { fontFamily: 'Roboto, system-ui, sans-serif' }

export default function ReviewPage() {
  const router = useRouter()
  const [data,        setData]        = useState<SynthesizeResponse | null>(null)
  const [statuses,    setStatuses]    = useState<Record<string, Status>>({})
  const [notes,       setNotes]       = useState<Record<string, string>>({})
  const [activeSource, setActiveSource] = useState<Source | null>(null)
  const [drawerOpen,   setDrawerOpen]   = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('brief_result')
    if (!raw) { router.push('/'); return }
    const parsed: SynthesizeResponse = JSON.parse(raw)
    setData(parsed)
    const init: Record<string, Status> = {}
    parsed.brief?.sections.forEach(s => {
      init[s.heading] = parsed.flag_for_review.includes(s.heading) ? 'flagged' : 'pending'
    })
    setStatuses(init)
  }, [router])

  const allReviewed = data?.brief?.sections.every(s => statuses[s.heading] !== 'pending')

  function handlePublish() {
    if (!data) return
    sessionStorage.setItem('brief_result', JSON.stringify({ ...data, review_decisions: statuses, review_notes: notes }))
    router.push('/brief')
  }

  if (!data?.brief) return (
    <>
      <Navbar />
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ ...R, color: '#9ab0bc' }}>Loading…</p>
      </main>
    </>
  )

  const { brief, flag_for_review, sources } = data
  const srcMap = Object.fromEntries(sources.map((s: Source) => [s.id, s]))

  function handleCiteClick(id: string) {
    const src = id === 'E4C'
      ? { id: 'E4C', title: 'Engineering For Change Knowledge Base', excerpt: 'Retrieved via KnowledgeXpert', url: 'https://www.engineeringforchange.org', source_type: 'e4c' }
      : srcMap[id] ?? null
    setActiveSource(src)
    setDrawerOpen(true)
  }

  const renderOpts = {
    sources:       srcMap,
    onCiteClick:   handleCiteClick,
    highlightedId: null,
  }
  const pendingCount = Object.values(statuses).filter(v => v === 'pending').length

  return (
    <>
      <Navbar />
      <SourceDrawer source={activeSource} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #1a3a4a, #00557b)', padding: '28px 24px', borderBottom: '3px solid #e6a817' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#e6a817', marginBottom: '8px' }}>
              ⚠ Human Review Required
            </p>
            <h1 style={{ ...R, fontWeight: 700, fontSize: '22px', color: 'white', lineHeight: 1.3, marginBottom: '6px' }}>{brief.title}</h1>
            <p style={{ ...R, fontSize: '13px', color: '#5cb1d0' }}>
              {data.topic} · {data.region} · {flag_for_review.length > 0 ? `${flag_for_review.length} section${flag_for_review.length > 1 ? 's' : ''} flagged` : 'No flags raised'}
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
              {(['pending', 'approved', 'flagged'] as Status[]).map(s => {
                const count = Object.values(statuses).filter(v => v === s).length
                const colors = { pending: '#9ab0bc', approved: '#5cb1d0', flagged: '#e6a817' }
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', background: colors[s] }} />
                    <span style={{ ...R, fontSize: '12px', color: '#9ab0bc', textTransform: 'capitalize' }}>{count} {s}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={handlePublish} disabled={!allReviewed}
            style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 22px', flexShrink: 0, border: allReviewed ? '2px dotted white' : '2px dotted #5a7280', background: allReviewed ? 'white' : 'transparent', color: allReviewed ? '#1a3a4a' : '#5a7280', cursor: allReviewed ? 'pointer' : 'not-allowed', whiteSpace: 'nowrap' }}>
            {allReviewed ? 'Publish Brief →' : `${pendingCount} Pending`}
          </button>
        </div>
      </div>

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Instructions */}
        <div style={{ background: '#fff8e6', borderLeft: '4px solid #e6a817', padding: '14px 18px', marginBottom: '24px' }}>
          <p style={{ ...R, fontSize: '13px', color: '#7a5010', lineHeight: 1.6 }}>
            Review each section below. Sections marked ⚠ contain assumptions or uncertainty flags.
            Approve sections you are satisfied with, or flag those needing further verification.
            The brief publishes only when all sections are reviewed.
          </p>
        </div>

        {/* Section cards */}
        {brief.sections.map(section => {
          const status = statuses[section.heading] ?? 'pending'
          const isFlagged = flag_for_review.includes(section.heading)
          const borderColor = status === 'approved' ? '#5cb1d0' : status === 'flagged' ? '#e6a817' : '#e8eef1'
          const bgColor = status === 'approved' ? '#f0f9fd' : status === 'flagged' ? '#fffbf0' : 'white'

          return (
            <div key={section.heading} style={{ border: `1.5px solid ${borderColor}`, background: bgColor, marginBottom: '12px' }}>
              {/* Card header */}
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isFlagged && <span style={{ color: '#e6a817' }}>⚠</span>}
                  <span style={{ ...R, fontWeight: 700, fontSize: '14px', color: '#00557b' }}>{section.heading}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button onClick={() => setStatuses(p => ({ ...p, [section.heading]: 'approved' }))}
                    style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 14px', border: status === 'approved' ? 'none' : '1px solid #b8dff0', background: status === 'approved' ? '#00557b' : 'white', color: status === 'approved' ? 'white' : '#00557b', cursor: 'pointer' }}>
                    ✓ Approve
                  </button>
                  <button onClick={() => setStatuses(p => ({ ...p, [section.heading]: 'flagged' }))}
                    style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '6px 14px', border: status === 'flagged' ? 'none' : '1px solid #f0d090', background: status === 'flagged' ? '#e6a817' : 'white', color: status === 'flagged' ? 'white' : '#7a5010', cursor: 'pointer' }}>
                    ⚑ Flag
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px 18px' }}>
                <p style={{ ...R, fontSize: '14px', color: '#3a5060', lineHeight: 1.7 }}>
                  {renderContent(section.content, renderOpts)}
                </p>
                {status === 'flagged' && (
                  <textarea value={notes[section.heading] ?? ''} onChange={e => setNotes(p => ({ ...p, [section.heading]: e.target.value }))}
                    placeholder="Note what needs verification…"
                    rows={2}
                    style={{ ...R, fontSize: '12px', width: '100%', marginTop: '12px', padding: '8px 12px', border: '1px solid #f0d090', background: '#fffbf0', color: '#7a5010', resize: 'none', outline: 'none' }}
                  />
                )}
              </div>
            </div>
          )
        })}

        {/* Data highlights */}
        <div style={{ background: 'white', border: '1px solid #e8eef1', padding: '20px', marginBottom: '12px' }}>
          <p style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00557b', marginBottom: '16px' }}>Data Highlights</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {brief.data_highlights.map((d, i) => {
              const src = srcMap[d.src_id]
              return (
                <div key={i} style={{ background: '#f5f7f8', padding: '12px' }}>
                  <p style={{ ...R, fontWeight: 700, fontSize: '15px', color: '#00557b', lineHeight: 1.3, marginBottom: '4px' }}>{d.stat}</p>
                  <p style={{ ...R, fontSize: '11px', color: '#9ab0bc' }}>{d.source_name}</p>
                  {src?.url && <a href={src.url} target="_blank" rel="noopener" style={{ ...R, fontSize: '10px', color: '#5cb1d0' }}>Source ↗</a>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Assumptions */}
        {brief.assumptions.length > 0 && (
          <div style={{ background: '#fff8e6', border: '1px solid #f0d090', padding: '20px', marginBottom: '12px' }}>
            <p style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7a5010', marginBottom: '12px' }}>Assumptions ({brief.assumptions.length})</p>
            {brief.assumptions.map((a, i) => (
              <p key={i} style={{ ...R, fontSize: '13px', color: '#7a5010', marginBottom: '6px' }}>⚠ {a}</p>
            ))}
          </div>
        )}

        {/* Limitations */}
        <div style={{ background: 'white', border: '1px solid #e8eef1', padding: '20px', marginBottom: '32px' }}>
          <p style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a7280', marginBottom: '8px' }}>Limitations</p>
          <p style={{ ...R, fontSize: '13px', color: '#5a7280', lineHeight: 1.6 }}>{brief.limitations}</p>
        </div>

        {/* Bottom publish */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handlePublish} disabled={!allReviewed}
            style={{ ...R, fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '14px 32px', border: allReviewed ? '2px dotted #1a3a4a' : '2px dotted #9ab0bc', background: allReviewed ? '#1a3a4a' : '#e8eef1', color: allReviewed ? 'white' : '#9ab0bc', cursor: allReviewed ? 'pointer' : 'not-allowed' }}>
            {allReviewed ? 'Publish Brief →' : `${pendingCount} Sections Still Pending`}
          </button>
        </div>
      </main>
    </>
  )
}