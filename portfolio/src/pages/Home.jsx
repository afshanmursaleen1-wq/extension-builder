import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Bot,
  Workflow,
  Code2,
  Zap,
  Rocket,
  Star,
  BrainCircuit,
  Layers,
  Settings2,
  Globe,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const stats = [
  { value: '50+', label: 'Automations Built' },
  { value: '3+', label: 'Years Experience' },
  { value: '30+', label: 'Happy Clients' },
  { value: '15+', label: 'SaaS Products' },
]

const tools = [
  { name: 'n8n', icon: Workflow },
  { name: 'Make.com', icon: Settings2 },
  { name: 'Replit', icon: Code2 },
  { name: 'VS Code', icon: Code2 },
  { name: 'Loveable', icon: Sparkles },
  { name: 'Antigravity', icon: Rocket },
]

const services = [
  {
    icon: Workflow,
    title: 'n8n Automation',
    desc: 'Custom workflow automations that connect your apps, data, and processes seamlessly.',
  },
  {
    icon: Settings2,
    title: 'Make.com Solutions',
    desc: 'Visual automation scenarios that streamline your business operations end-to-end.',
  },
  {
    icon: BrainCircuit,
    title: 'Agentic AI',
    desc: 'Intelligent AI agents that think, plan, and execute tasks autonomously.',
  },
  {
    icon: Code2,
    title: 'Vibe Coding',
    desc: 'Rapid prototyping and development using AI-powered coding workflows.',
  },
  {
    icon: Layers,
    title: 'SaaS Development',
    desc: 'Full-stack SaaS applications built with modern tools and best practices.',
  },
  {
    icon: Globe,
    title: 'API Integrations',
    desc: 'Seamless third-party API integrations to extend your product capabilities.',
  },
]

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Startup Founder',
    text: 'Afshan transformed our manual processes into fully automated workflows. Our team saves 20+ hours per week now.',
    rating: 5,
  },
  {
    name: 'David K.',
    role: 'E-commerce Owner',
    text: 'The AI agent Afshan built handles our customer inquiries brilliantly. Response time went from hours to seconds.',
    rating: 5,
  },
  {
    name: 'Maria L.',
    role: 'Marketing Director',
    text: 'Outstanding SaaS product delivery. Afshan understood our vision perfectly and executed beyond expectations.',
    rating: 5,
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-800/15 rounded-full blur-3xl" />
        </div>

        <div className="container-custom mx-auto px-4 md:px-8 pt-24 pb-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px w-12 bg-primary-500" />
                <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">
                  AI Automation Expert
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display leading-tight mb-6">
                I am Afshan,
                <br />
                <span className="gradient-text">Automation</span>
                <br />
                <span className="highlight-text text-5xl md:text-6xl lg:text-7xl">Architect.</span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
                I craft intelligent automation systems, build AI agents, and develop 
                SaaS products that transform how businesses operate. Turning complex 
                workflows into seamless experiences.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/contact" className="btn-primary text-base">
                  <Zap size={18} />
                  Let&apos;s Automate
                </Link>
                <Link to="/portfolio" className="btn-outline text-base">
                  View Projects
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 border-2 border-dark-500 flex items-center justify-center text-xs font-bold"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-sm">Trusted by 30+ clients</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-primary-800/20 rounded-3xl blur-2xl" />
                <div className="relative glass-card p-8 rounded-3xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
                      <Bot className="text-primary-400" size={24} />
                      <div>
                        <p className="text-sm font-medium">AI Agent Active</p>
                        <p className="text-xs text-gray-400">Processing 1,247 tasks today</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                      <Workflow className="text-green-400" size={24} />
                      <div>
                        <p className="text-sm font-medium">Automation Running</p>
                        <p className="text-xs text-gray-400">12 workflows active</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <Rocket className="text-blue-400" size={24} />
                      <div>
                        <p className="text-sm font-medium">SaaS Deployed</p>
                        <p className="text-xs text-gray-400">99.9% uptime this month</p>
                      </div>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-dark-400/50 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Efficiency Boost</span>
                        <span className="text-xs text-primary-400 font-semibold">+340%</span>
                      </div>
                      <div className="w-full h-2 bg-dark-300/50 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-primary-500 to-primary-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scrolling Brands */}
      <section className="py-8 border-y border-white/5 bg-dark-600/30 overflow-hidden">
        <div className="flex animate-[scroll_20s_linear_infinite] gap-12 items-center whitespace-nowrap">
          {[...tools, ...tools].map((tool, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500 font-medium text-sm uppercase tracking-widest">
              <tool.icon size={18} />
              {tool.name}
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card p-6 md:p-8 text-center rounded-2xl"
              >
                <div className="text-3xl md:text-5xl font-bold font-display gradient-text mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="Tools I wield with"
            highlight="precision."
            subtitle="Years of mastering the right tools — from n8n to Replit — to build intelligent systems that scale."
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="glass-card-hover p-6 text-center rounded-xl"
              >
                <tool.icon className="mx-auto mb-3 text-primary-400" size={32} />
                <p className="text-sm font-medium">{tool.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="Services I offer with"
            highlight="craft & care."
            subtitle="From AI agents to full-stack SaaS — I deliver end-to-end solutions tailored to your business needs."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card-hover p-6 md:p-8 rounded-2xl group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <service.icon className="text-primary-400" size={24} />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-1 text-primary-400 text-sm mt-4 hover:gap-2 transition-all"
                >
                  Learn more <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="What"
            highlight="clients say."
            subtitle="Real feedback from people I've helped transform their businesses through automation and AI."
          />
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-card p-6 md:p-8 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <motion.div
            {...fadeInUp}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-900/60 via-primary-800/40 to-primary-900/60 border border-primary-500/20 p-10 md:p-16 text-center"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.2),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
                Let&apos;s create something
                <br />
                <span className="highlight-text">amazing</span> together.
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8 text-lg">
                Got an idea for an automation, AI agent, or SaaS product? 
                Let&apos;s connect and build it together.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact" className="btn-primary text-base">
                  <Sparkles size={18} />
                  Get in Touch
                </Link>
                <Link to="/services" className="btn-outline text-base">
                  Explore Services
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
