import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Workflow,
  Code2,
  BrainCircuit,
  Rocket,
  Settings2,
  Sparkles,
  Globe,
  Layers,
  ArrowRight,
  Check,
  MessageSquare,
  Zap,
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const services = [
  {
    icon: Workflow,
    title: 'n8n Automation',
    desc: 'End-to-end workflow automation using n8n to connect your applications, databases, and APIs. I design reliable, self-healing automations that run 24/7.',
    features: [
      'Custom workflow design & implementation',
      'Multi-step data processing pipelines',
      'Error handling & monitoring setup',
      'Webhook & trigger configurations',
      'Database sync & migration flows',
    ],
  },
  {
    icon: Settings2,
    title: 'Make.com Solutions',
    desc: 'Visual automation scenarios on Make.com that streamline your business operations. From simple task automation to complex multi-app integrations.',
    features: [
      'Scenario design & optimization',
      'Multi-app integration workflows',
      'Data transformation & mapping',
      'Scheduled & event-driven automations',
      'Performance monitoring & scaling',
    ],
  },
  {
    icon: BrainCircuit,
    title: 'Agentic AI Development',
    desc: 'Build intelligent AI agents that can reason, plan, and execute complex tasks autonomously. Leverage the latest LLM capabilities for your business.',
    features: [
      'Custom AI agent architecture',
      'LLM integration (GPT, Claude, etc.)',
      'RAG systems & knowledge bases',
      'Multi-agent orchestration',
      'Tool-use & function calling setup',
    ],
  },
  {
    icon: Sparkles,
    title: 'Vibe Coding',
    desc: 'Rapid prototyping and development using AI-powered coding workflows. Build functional products in days, not months, using the latest AI coding tools.',
    features: [
      'AI-assisted rapid prototyping',
      'Full-stack app scaffolding',
      'UI/UX design to code conversion',
      'Codebase optimization with AI',
      'Deployment & CI/CD setup',
    ],
  },
  {
    icon: Layers,
    title: 'SaaS Development',
    desc: 'Full-stack SaaS application development from concept to launch. Modern tech stacks, scalable architecture, and production-ready deployments.',
    features: [
      'MVP to full product development',
      'Authentication & user management',
      'Stripe/payment integration',
      'Admin dashboards & analytics',
      'Database design & optimization',
    ],
  },
  {
    icon: Globe,
    title: 'API Integration',
    desc: 'Seamless integration of third-party APIs and services into your existing systems. RESTful, GraphQL, WebSocket — I handle it all.',
    features: [
      'Third-party API integration',
      'Custom API development',
      'OAuth & authentication flows',
      'Real-time data synchronization',
      'Rate limiting & error handling',
    ],
  },
]

const packages = [
  {
    name: 'Starter',
    price: '499',
    desc: 'Perfect for small businesses starting their automation journey.',
    features: [
      'Up to 3 automation workflows',
      'Basic AI integration',
      'Email & chat support',
      '1 month of maintenance',
      'Documentation included',
    ],
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '999',
    desc: 'For growing businesses that need robust automation and AI solutions.',
    features: [
      'Up to 10 automation workflows',
      'Advanced AI agent setup',
      'Priority support',
      '3 months of maintenance',
      'Performance monitoring',
      'Custom integrations',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '2,499',
    desc: 'Complete automation transformation for large-scale operations.',
    features: [
      'Unlimited automation workflows',
      'Multi-agent AI systems',
      'Dedicated support channel',
      '6 months of maintenance',
      'Full SaaS development',
      'On-call support',
      'Strategy consultation',
    ],
    highlighted: false,
  },
]

const process = [
  {
    step: '01',
    icon: MessageSquare,
    title: 'Discovery',
    desc: 'We discuss your business needs, current pain points, and desired outcomes.',
  },
  {
    step: '02',
    icon: Layers,
    title: 'Architecture',
    desc: 'I design the automation system, AI agent logic, or SaaS architecture.',
  },
  {
    step: '03',
    icon: Code2,
    title: 'Build',
    desc: 'Development and implementation with regular progress updates and feedback loops.',
  },
  {
    step: '04',
    icon: Rocket,
    title: 'Launch',
    desc: 'Deployment, testing, and handover with documentation and training.',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Services() {
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
                What I Do
              </span>
              <div className="h-px w-12 bg-primary-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Services built with
              <br />
              <span className="highlight-text">expertise</span> & dedication.
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From AI-powered automation to full-stack SaaS development — I offer 
              comprehensive solutions that transform your business operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card-hover p-6 md:p-8 rounded-2xl group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mb-5 group-hover:bg-primary-500/20 transition-colors">
                  <service.icon className="text-primary-400" size={28} />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check size={14} className="text-primary-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="My working"
            highlight="process."
            subtitle="A structured approach to deliver the best results for every project."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center relative">
                  <p.icon className="text-primary-400" size={28} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-600 text-xs font-bold flex items-center justify-center">
                    {p.step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-gray-400 text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="Simple, honest"
            highlight="pricing."
            subtitle="Transparent packages designed to fit your needs. Custom quotes available for unique projects."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {packages.map((pkg, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`rounded-2xl p-6 md:p-8 relative ${
                  pkg.highlighted
                    ? 'bg-gradient-to-b from-primary-900/40 to-dark-500 border-2 border-primary-500/40 shadow-lg shadow-primary-500/10'
                    : 'glass-card'
                }`}
              >
                {pkg.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="font-display font-semibold text-lg mb-1">{pkg.name}</h3>
                <p className="text-gray-400 text-xs mb-4">{pkg.desc}</p>
                <div className="mb-6">
                  <span className="text-gray-400 text-sm">$</span>
                  <span className="text-4xl font-bold font-display">{pkg.price}</span>
                  <span className="text-gray-400 text-sm"> /project</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                      <Check size={14} className="text-primary-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`w-full justify-center ${pkg.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  <Zap size={16} />
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Need a <span className="highlight-text">custom</span> solution?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Every business is unique. Let&apos;s discuss your specific needs and create 
              a tailored solution that fits perfectly.
            </p>
            <Link to="/contact" className="btn-primary text-base">
              Let&apos;s Talk <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
