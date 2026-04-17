import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'E4C Insights — AI-Powered Knowledge Products',
  description:
    'Generate publishable, decision-grade policy briefs grounded in E4C knowledge and open data.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
