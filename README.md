# E4C Insights — Frontend

Next.js web app for generating AI-powered policy briefs from E4C knowledge.

## Flow

1. **Home** (`/`) — select a topic and region
2. **Generate** (`/generate`) — live progress screen while the backend works
3. **Review** (`/review`) — human-in-the-loop approval screen, section by section
4. **Brief** (`/brief`) — final published brief with clickable citations and source drawer

## Setup

```bash
npm install
cp .env.local.example .env.local   # or create .env.local manually
npm run dev
```

Open `http://localhost:3000`.

## Environment

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production (Vercel), set `NEXT_PUBLIC_API_URL` to your Railway backend URL.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Framework: Next.js (auto-detected)
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app`
5. Deploy

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Source Serif 4 + DM Sans (Google Fonts)

## Design

Follows E4C's visual language: clean white surfaces, teal/green accent (`#1a7a4a`),
editorial typography, minimal decoration. Built to feel like a native extension
of engineeringforchange.org.
# e4c-frontend
