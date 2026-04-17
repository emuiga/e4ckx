'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header style={{ background: '#1a3a4a' }} className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          <div style={{ border: '2px solid #5cb1d0', padding: '3px 7px' }}>
            <span style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontWeight: 700, fontSize: '14px', color: '#5cb1d0', letterSpacing: '0.05em' }}>
              e4c
            </span>
          </div>
          <span style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontWeight: 400, fontSize: '15px', color: 'white' }}>
            Insights
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <a href="/" style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontSize: '14px', color: '#5cb1d0', textDecoration: 'none' }}>
            Generate
          </a>
          <a href="https://www.engineeringforchange.org" target="_blank" rel="noopener"
            style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontSize: '14px', color: '#5cb1d0', textDecoration: 'none' }}>
            E4C.org ↗
          </a>
          <div style={{ border: '2px dotted white', padding: '6px 16px' }}>
            <span style={{ fontFamily: 'Roboto, system-ui, sans-serif', fontWeight: 700, fontSize: '11px', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Hackathon Demo
            </span>
          </div>
        </nav>
      </div>
    </header>
  )
}
