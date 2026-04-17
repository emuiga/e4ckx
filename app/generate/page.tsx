'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { synthesize, SynthesizeResponse } from '@/lib/api'
import Navbar from '@/components/Navbar'

const R = { fontFamily: 'Roboto, system-ui, sans-serif' }

const STEPS = [
  'Querying E4C Solutions Library…',
  'Querying E4C Research & News…',
  'Fetching World Bank open data…',
  'Fetching WHO health statistics…',
  'Synthesising brief with GPT-4o…',
  'Building citation registry…',
  'Finalising output…',
]

function GenerateContent() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const topic        = searchParams.get('topic')  ?? ''
  const region       = searchParams.get('region') ?? 'Sub-Saharan Africa'

  const [step,    setStep]    = useState(0)
  const [error,   setError]   = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!topic) { router.push('/'); return }

    let s = 0
    const ticker = setInterval(() => { s = Math.min(s + 1, STEPS.length - 1); setStep(s) }, 13000)
    const clock  = setInterval(() => setElapsed(e => e + 1), 1000)

    synthesize({ topic, region })
      .then((data: SynthesizeResponse) => {
        clearInterval(ticker); clearInterval(clock)
        sessionStorage.setItem('brief_result', JSON.stringify(data))
        router.push('/review')
      })
      .catch(err => { clearInterval(ticker); clearInterval(clock); setError(err.message) })

    return () => { clearInterval(ticker); clearInterval(clock) }
  }, [topic, region, router])

  return (
    <>
      {/* Teal hero strip */}
      <div style={{ background: 'linear-gradient(135deg, #1a3a4a, #00557b)', padding: '24px', borderBottom: '3px solid #5cb1d0' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ ...R, fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5cb1d0', marginBottom: '6px' }}>
            Generating Brief
          </p>
          <p style={{ ...R, fontSize: '18px', color: 'white' }}>{topic} · {region}</p>
        </div>
      </div>

      <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#f5f7f8' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: 'white', border: '1px solid #e8eef1', padding: '32px' }}>
          {error ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ ...R, fontWeight: 700, fontSize: '16px', color: '#c0392b', marginBottom: '12px' }}>Generation failed</p>
              <p style={{ ...R, fontSize: '13px', color: '#5a7280', lineHeight: 1.6, marginBottom: '20px' }}>{error}</p>
              <button onClick={() => router.push('/')} style={{ ...R, fontWeight: 700, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '10px 24px', border: '2px dotted #1a3a4a', background: '#1a3a4a', color: 'white', cursor: 'pointer' }}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div style={{ height: '4px', background: '#e8eef1', marginBottom: '28px' }}>
                <div style={{ height: '100%', background: '#00557b', transition: 'width 2s ease-out', width: `${((step + 1) / STEPS.length) * 100}%` }} />
              </div>

              {/* Steps */}
              <div style={{ marginBottom: '24px' }}>
                {STEPS.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', opacity: i > step ? 0.3 : 1, transition: 'opacity 0.4s' }}>
                    <div style={{
                      width: '20px', height: '20px', flexShrink: 0,
                      border: i < step ? 'none' : `2px solid ${i === step ? '#00557b' : '#b8dff0'}`,
                      background: i < step ? '#00557b' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {i < step
                        ? <span style={{ color: 'white', fontSize: '11px' }}>✓</span>
                        : i === step
                        ? <div style={{ width: '8px', height: '8px', background: '#00557b', animation: 'pulse 1.4s ease-in-out infinite' }} />
                        : null}
                    </div>
                    <span style={{ ...R, fontSize: '14px', fontWeight: i === step ? 700 : 400, color: i === step ? '#00557b' : '#5a7280' }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              <p style={{ ...R, fontSize: '12px', color: '#9ab0bc', textAlign: 'center' }}>
                {elapsed}s elapsed · typically 60–90 seconds
              </p>
            </>
          )}
        </div>
      </main>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </>
  )
}

export default function GeneratePage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7f8' }}>
          <p style={{ fontFamily: 'Roboto, system-ui, sans-serif', color: '#9ab0bc' }}>Loading…</p>
        </main>
      }>
        <GenerateContent />
      </Suspense>
    </>
  )
}