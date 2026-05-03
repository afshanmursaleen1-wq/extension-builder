import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Workflow,
  Code2,
  BrainCircuit,
  Rocket,
  Settings2,
  Sparkles,
  Calendar,
  MapPin,
  Award,
  Target,
  ArrowRight,
} from 'lucide-react'
import SectionTitle from '../components/SectionTitle'

const skills = [
  { name: 'n8n Automation', level: 95, icon: Workflow },
  { name: 'Make.com', level: 90, icon: Settings2 },
  { name: 'Agentic AI', level: 88, icon: BrainCircuit },
  { name: 'Vibe Coding', level: 92, icon: Sparkles },
  { name: 'SaaS Development', level: 85, icon: Rocket },
  { name: 'API Integration', level: 90, icon: Code2 },
]

const timeline = [
  {
    year: '2024 - Present',
    title: 'AI Automation Specialist',
    company: 'Freelance',
    desc: 'Building intelligent automation systems with n8n, Make.com, and Agentic AI for businesses worldwide. Developing SaaS products using vibe coding methodologies.',
    icon: BrainCircuit,
  },
  {
    year: '2023 - 2024',
    title: 'Automation Engineer',
    company: 'SaaS Consultancy',
    desc: 'Designed and implemented complex automation workflows for enterprise clients. Integrated AI agents into existing business processes.',
    icon: Workflow,
  },
  {
    year: '2022 - 2023',
    title: 'Full-Stack Developer',
    company: 'Tech Startup',
    desc: 'Built and shipped multiple SaaS applications. Gained deep expertise in modern development tools and rapid prototyping with AI assistance.',
    icon: Code2,
  },
]

const values = [
  {
    icon: Target,
    title: 'Precision',
    desc: 'Every automation is crafted with meticulous attention to detail and edge-case handling.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    desc: 'Always exploring the cutting-edge of AI, automation, and development tools.',
  },
  {
    icon: Award,
    title: 'Quality',
    desc: 'Delivering production-ready solutions that scale with your business growth.',
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative gradient-bg pt-32 pb-20 px-4 md:px-8">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-12 bg-primary-500" />
                <span className="text-primary-400 text-sm font-medium uppercase tracking-wider">
                  About Me
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
                Passionate about
                <br />
                <span className="highlight-text">intelligent</span> systems.
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                I&apos;m Afshan Mursaleen — an AI Automation Expert with a passion for 
                building systems that think, adapt, and scale. I specialize in turning 
                complex business challenges into elegant automated solutions using 
                cutting-edge tools like n8n, Make.com, and Agentic AI frameworks.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                With expertise in vibe coding and SaaS development, I bridge the gap 
                between powerful AI capabilities and practical business applications. 
                Every project I take on is an opportunity to push boundaries and deliver 
                exceptional results.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <MapPin size={16} className="text-primary-400" />
                  Available Worldwide (Remote)
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar size={16} className="text-primary-400" />
                  3+ Years of Experience
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
                <div className="space-y-6">
                  {values.map((v, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                        <v.icon className="text-primary-400" size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold font-display mb-1">{v.title}</h3>
                        <p className="text-gray-400 text-sm">{v.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="Skills &"
            highlight="expertise."
            subtitle="My core competencies span automation, AI, and full-stack development."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card p-5 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <skill.icon className="text-primary-400" size={20} />
                    <span className="font-medium text-sm">{skill.name}</span>
                  </div>
                  <span className="text-primary-400 text-sm font-semibold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 bg-dark-300/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-300 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto">
          <SectionTitle
            title="My professional"
            highlight="journey."
            subtitle="A timeline of growth, learning, and building impactful solutions."
          />
          <div className="max-w-3xl mx-auto space-y-8">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                {...fadeInUp}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative pl-8 md:pl-12"
              >
                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/40 flex items-center justify-center">
                  <item.icon className="text-primary-400" size={16} />
                </div>
                {i < timeline.length - 1 && (
                  <div className="absolute left-[15px] top-8 w-px h-[calc(100%+2rem)] bg-gradient-to-b from-primary-500/30 to-transparent" />
                )}
                <div className="glass-card p-6 rounded-xl ml-4">
                  <span className="text-primary-400 text-xs font-medium uppercase tracking-wider">
                    {item.year}
                  </span>
                  <h3 className="font-display font-semibold text-lg mt-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm">{item.company}</p>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-custom mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Ready to work <span className="highlight-text">together?</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Let&apos;s discuss how I can help automate your business or build your next SaaS product.
            </p>
            <Link to="/contact" className="btn-primary text-base">
              Get in Touch <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
