# Afshan Mursaleen - Portfolio Website

A modern, dark-themed portfolio website showcasing AI automation, SaaS development, and vibe coding expertise.

## Tech Stack

- **React 18** + **Vite** - Fast, modern frontend
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Supabase** - Backend for contact form data
- **Lucide React** - Beautiful icons

## Pages

- **Home** - Hero, stats, tools, services preview, testimonials, CTA
- **About** - Bio, skills with progress bars, experience timeline
- **Services** - Service cards, process workflow, pricing packages
- **Portfolio** - Filterable project gallery with categories
- **Contact** - Contact form with Supabase integration

## Quick Start

```bash
cd portfolio
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Supabase Setup (for Contact Form)

1. Create a project at [supabase.com](https://supabase.com)
2. Create a `contacts` table with these columns:
   - `id` (uuid, primary key, default: `gen_random_uuid()`)
   - `name` (text)
   - `email` (text)
   - `subject` (text)
   - `message` (text)
   - `created_at` (timestamptz, default: `now()`)
3. Copy your project URL and anon key
4. Create a `.env` file (from `.env.example`):

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

The contact form works in demo mode without Supabase configured.

## Build for Production

```bash
npm run build
npm run preview
```

## Deploying on Replit

1. Create a new Replit project
2. Upload all files from this `portfolio` directory
3. Set the run command to `npm run dev`
4. Add environment secrets for Supabase (optional)
5. Hit Run!
