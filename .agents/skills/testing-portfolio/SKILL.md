---
name: testing-portfolio
description: Test the portfolio website end-to-end. Use when verifying portfolio UI changes, page rendering, contact form, or responsive design.
---

# Testing the Portfolio Website

## Prerequisites
- Node.js installed
- Portfolio dependencies installed: `cd portfolio && npm install`

## Running the Dev Server
```bash
cd portfolio && npm run dev
```
The site runs at `http://localhost:3000`.

## Pages to Test

### Home (`/`)
- Hero section: heading "I am Afshan, Automation Architect."
- Stats: 4 cards (50+, 3+, 30+, 15+)
- Tools banner: 6 tools (n8n, Make.com, Replit, VS Code, Loveable, Antigravity)
- Services: 6 cards (n8n Automation, Make.com Solutions, Agentic AI, Vibe Coding, SaaS Development, API Integrations)
- Testimonials: 3 cards with 5-star ratings
- CTA: "Let's create something amazing together."

### About (`/about`)
- Heading: "Passionate about intelligent systems."
- Skills: 6 items with animated progress bars (n8n 95%, Make.com 90%, Agentic AI 88%, Vibe Coding 92%, SaaS Dev 85%, API Integration 90%)
- Timeline: 3 entries (2024-Present, 2023-2024, 2022-2023)

### Services (`/services`)
- Heading: "Services built with expertise & dedication."
- 6 detailed service cards with feature lists
- Process: 4-step workflow (Discovery, Architecture, Build, Launch)
- Pricing: 3 tiers (Starter $499, Professional $999, Enterprise $2,499)

### Portfolio (`/portfolio`)
- Heading: "Selected projects shipped with love."
- Filter buttons: All, Automation, AI Agents, SaaS, Integrations
- Expected card counts: All=9, Automation=3, AI Agents=3, SaaS=2, Integrations=1
- Active filter should have purple bg (bg-primary-600)

### Contact (`/contact`)
- Heading: "Say hello."
- Form fields: Name, Email, Subject, Message
- Without Supabase: submitting shows "Message received (demo mode - Supabase not configured)" in green
- Form clears after successful submission
- Contact info cards: Email, Location, Response Time

## Mobile Responsiveness
- At ~400px width, hamburger menu replaces desktop nav
- Mobile menu shows all 5 links + "Hire Me" button
- Content stacks vertically in single column

## Supabase Integration
- Contact form works in demo mode without Supabase configuration
- For production: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
- Supabase needs a `contacts` table with columns: id (uuid), name, email, subject, message, created_at

## Lint & Build
```bash
cd portfolio && npx eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0
cd portfolio && npx vite build
```

## Devin Secrets Needed
- `VITE_SUPABASE_URL` — Supabase project URL (optional, for contact form persistence)
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key (optional, for contact form persistence)
