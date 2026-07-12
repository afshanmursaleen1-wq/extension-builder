import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  ArrowRight,
  Workflow,
  BrainCircuit,
  Code2,
  Layers,
  Sparkles,
  Settings2,
} from 'lucide-react'
const categories = ['All', 'Automation', 'AI Agents', 'SaaS', 'Integrations']

const projects = [
  {
    title: 'E-Commerce Automation Hub',
    category: 'Automation',
    icon: Workflow,
    desc: 'Complete n8n automation suite for an e-commerce business — order processing, inventory sync, customer notifications, and analytics reporting.',
    tags: ['n8n', 'Shopify API', 'Slack', 'Google Sheets'],
    gradient: 'from-purple-500/20 to-blue-500/20',
  },
  {
    title: 'AI Customer Support Agent',
    category: 'AI Agents',
    icon: BrainCircuit,
    desc: 'Intelligent AI agent that handles customer inquiries, routes tickets, and provides instant responses using RAG with company knowledge base.',
    tags: ['GPT-4', 'LangChain', 'Pinecone', 'FastAPI'],
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    title: 'SaaS Analytics Dashboard',
    category: 'SaaS',
    icon: Layers,
    desc: 'Full-stack SaaS application for business analytics with real-time data visualization, user management, and Stripe billing integration.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  {
    title: 'Lead Gen Automation Pipeline',
    category: 'Automation',
    icon: Settings2,
    desc: 'Make.com automation that captures leads from multiple sources, enriches data, scores prospects, and feeds them into CRM with automated follow-ups.',
    tags: ['Make.com', 'HubSpot', 'Clearbit', 'Gmail'],
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    title: 'Multi-Agent Research System',
    category: 'AI Agents',
    icon: BrainCircuit,
    desc: 'Orchestrated multi-agent system that researches topics, synthesizes information, and generates comprehensive reports autonomously.',
    tags: ['Claude', 'CrewAI', 'Tavily', 'Python'],
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  {
    title: 'Vibe-Coded Project Manager',
    category: 'SaaS',
    icon: Sparkles,
    desc: 'Project management tool built using vibe coding methodology — from concept to deployment in 48 hours using Replit and AI-assisted development.',
    tags: ['Replit', 'React', 'Supabase', 'Tailwind'],
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'CRM-to-ERP Integration Bridge',
    category: 'Integrations',
    icon: Code2,
    desc: 'Bi-directional data synchronization between Salesforce CRM and SAP ERP, handling real-time updates, conflict resolution, and data mapping.',
    tags: ['n8n', 'Salesforce', 'SAP', 'REST API'],
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    title: 'Content Automation Engine',
    category: 'Automation',
    icon: Workflow,
    desc: 'AI-powered content generation and distribution pipeline — creates blog posts, social media content, and newsletters on autopilot.',
    tags: ['Make.com', 'GPT-4', 'WordPress', 'Buffer'],
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    title: 'AI Invoice Processor',
    category: 'AI Agents',
    icon: BrainCircuit,
    desc: 'Intelligent document processing agent that extracts data from invoices, validates entries, and syncs with accounting software automatically.',
    tags: ['GPT-4 Vision', 'n8n', 'QuickBooks', 'OCR'],
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-bg pt-32 pb-20 px-4 md:px-8">
        <div className="container-custom mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-primary-500" />
              <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">
                My Work
              </span>
              <div className="h-px w-12 bg-primary-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Selected <span className="highlight-text">projects</span>
              <br />
              shipped with love.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A showcase of automation systems, AI agents, and SaaS products 
              I&apos;ve built for clients across industries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Projects */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="glass-card-hover rounded-2xl overflow-hidden group"
                >
                  {/* Project Card Header */}
                  <div className={`h-40 bg-gradient-to-br ${project.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-dark-500/40" />
                    <project.icon
                      className="text-white/60 group-hover:text-white/80 transition-colors relative z-10"
                      size={56}
                    />
                  </div>

                  {/* Project Card Body */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-primary-400 text-xs font-medium uppercase tracking-wider">
                        {project.category}
                      </span>
                      <ExternalLink
                        size={16}
                        className="text-gray-500 group-hover:text-primary-400 transition-colors"
                      />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, j) => (
                        <span
                          key={j}
                          className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Have a project in <span className="highlight-text">mind?</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              I&apos;m always excited to work on new automation challenges and AI projects. 
              Let&apos;s bring your idea to life.
            </p>
            <Link to="/contact" className="btn-primary text-base">
              Start a Project <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
