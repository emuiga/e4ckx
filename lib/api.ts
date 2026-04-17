const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

export interface SynthesizeRequest {
  topic:  string
  region: string
}

export interface Source {
  id:          string
  title:       string
  excerpt:     string
  url:         string
  source_type: string
}

export interface Section {
  heading: string
  content: string
}

export interface DataHighlight {
  stat:        string
  src_id:      string
  source_name: string
}

export interface Brief {
  title:               string
  executive_summary:   string
  sections:            Section[]
  key_findings:        string[]
  data_highlights:     DataHighlight[]
  assumptions:         string[]
  limitations:         string
  recommended_sections_for_review: string[]
}

export interface SynthesizeResponse {
  topic:           string
  region:          string
  brief:           Brief | null
  cited_src_ids:   string[]
  flag_for_review: string[]
  sources:         Source[]
  error:           string | null
}

export async function synthesize(req: SynthesizeRequest): Promise<SynthesizeResponse> {
  const res = await fetch(`${API}/synthesize`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(req),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail ?? 'Synthesis failed')
  }
  return res.json()
}

export async function getSource(id: string): Promise<Source> {
  const res = await fetch(`${API}/sources/${id}`)
  if (!res.ok) throw new Error(`Source ${id} not found`)
  return res.json()
}
