'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

const TOPICS = [
  'Clean cooking',
  'Solar energy access',
  'Safe water systems',
  'Sanitation & hygiene',
  'Agricultural technology',
  'Low-cost housing',
  'Community health',
  'ICT for development',
]

const REGIONS = [
  'Sub-Saharan Africa',
  'East Africa',
  'West Africa',
  'South Asia',
  'Southeast Asia',
  'Latin America',
  'Middle East & North Africa',
]

const R = { fontFamily: 'Roboto, system-ui, sans-serif' }

export default function Home() {
  const router  = useRouter()
  const [topic,  setTopic]  = useState('')
  const [region, setRegion] = useState('Sub-Saharan Africa')
  const [custom, setCustom] = useState(false)
  const canSubmit = topic.trim().length > 2

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    router.push(`/generate?${new URLSearchParams({ topic: topic.trim(), region })}`)
  }

  return (
    <>
      <Navbar />

      {/* Hero — E4C teal style */}
      <section style={{ background: 'linear-gradient(135deg, #1a3a4a 0%, #00557b 60%, #3fa9cc 100%)', padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5cb1d0', marginBottom: '16px' }}>
            AI-Powered Engineering Insights
          </p>
          <h1 style={{ ...R, fontWeight: 700, fontSize: '40px', lineHeight: '50px', color: 'white', marginBottom: '20px', maxWidth: '640px' }}>
            Generate a Decision-Grade Policy Brief
          </h1>
          <p style={{ ...R, fontWeight: 400, fontSize: '18px', lineHeight: '27px', color: '#5cb1d0', maxWidth: '560px' }}>
            Grounded in E4C&apos;s curated knowledge base and enriched with World Bank and WHO open data.
            Every claim is cited. Every source is traceable.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        <form onSubmit={handleSubmit}>

          {/* Topic */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00557b', marginBottom: '16px' }}>
              Select a Topic
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              {TOPICS.map(t => (
                <button key={t} type="button" onClick={() => { setTopic(t); setCustom(false) }}
                  style={{
                    ...R, fontWeight: 400, fontSize: '14px',
                    padding: '8px 18px',
                    border: topic === t && !custom ? '2px solid #00557b' : '1px solid #b8dff0',
                    background: topic === t && !custom ? '#00557b' : 'white',
                    color: topic === t && !custom ? 'white' : '#00557b',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  {t}
                </button>
              ))}
              <button type="button" onClick={() => { setCustom(true); setTopic('') }}
                style={{
                  ...R, fontWeight: 400, fontSize: '14px',
                  padding: '8px 18px',
                  border: custom ? '2px solid #00557b' : '1px dashed #9ab0bc',
                  background: custom ? '#00557b' : 'white',
                  color: custom ? 'white' : '#5a7280',
                  cursor: 'pointer',
                }}>
                Custom…
              </button>
            </div>
            {custom && (
              <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Off-grid refrigeration for vaccines"
                autoFocus
                style={{
                  ...R, fontSize: '14px', width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #b8dff0',
                  outline: 'none',
                  color: '#1a2a34',
                }}
              />
            )}
          </div>

          {/* Region */}
          <div style={{ marginBottom: '40px' }}>
            <p style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#00557b', marginBottom: '16px' }}>
              Select a Region
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {REGIONS.map(r => (
                <button key={r} type="button" onClick={() => setRegion(r)}
                  style={{
                    ...R, fontWeight: 400, fontSize: '14px',
                    padding: '8px 18px',
                    border: region === r ? '2px solid #1a3a4a' : '1px solid #b8dff0',
                    background: region === r ? '#1a3a4a' : 'white',
                    color: region === r ? 'white' : '#1a3a4a',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div style={{ background: '#e8f5fb', borderLeft: '4px solid #5cb1d0', padding: '16px 20px', marginBottom: '32px' }}>
            <p style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00557b', marginBottom: '10px' }}>
              What gets generated
            </p>
            {['5-section policy brief with inline citations', 'Key findings and data highlights from E4C sources', 'World Bank & WHO open data statistics, fully cited', 'Human review screen before the brief is finalised'].map(item => (
              <p key={item} style={{ ...R, fontSize: '14px', color: '#00557b', marginBottom: '4px' }}>✓ {item}</p>
            ))}
          </div>

          {/* Submit */}
          <button type="submit" disabled={!canSubmit}
            style={{
              ...R, fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', textTransform: 'uppercase',
              width: '100%', padding: '14px',
              border: canSubmit ? '2px dotted #1a3a4a' : '2px dotted #9ab0bc',
              background: canSubmit ? '#1a3a4a' : '#e8eef1',
              color: canSubmit ? 'white' : '#9ab0bc',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}>
            {canSubmit ? `Generate Brief — ${topic}, ${region}` : 'Select a Topic to Continue'}
          </button>
        </form>

        {/* Footer note */}
        <p style={{ ...R, fontSize: '12px', color: '#9ab0bc', lineHeight: '1.6', marginTop: '32px' }}>
          This tool is a prototype built for the E4C AI Hackathon 2026. All outputs are AI-assisted
          and require human review before use. No causal claims or policy prescriptions are made by the system.
        </p>
      </main>
    </>
  )
}
