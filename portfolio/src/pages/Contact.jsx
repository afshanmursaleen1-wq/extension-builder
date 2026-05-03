import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Github,
  Linkedin,
  Twitter,
  Loader2,
} from 'lucide-react'
import { submitContactForm } from '../lib/supabase'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'afshanmursaleen1@gmail.com',
    href: 'mailto:afshanmursaleen1@gmail.com',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Available Worldwide (Remote)',
    href: null,
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: 'Within 24 hours',
    href: null,
  },
]

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: '', message: '' })

    try {
      const result = await submitContactForm(form)
      setStatus({ type: 'success', message: result.message })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

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
                Get in Touch
              </span>
              <div className="h-px w-12 bg-primary-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6">
              Say <span className="highlight-text">hello.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have a project idea, need automation help, or just want to chat? 
              Drop me a message and I&apos;ll get back to you within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="section-padding">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Left Column - Contact Info */}
            <motion.div {...fadeInUp} className="lg:col-span-2 space-y-6">
              {contactInfo.map((item, i) => (
                <div key={i} className="glass-card p-5 rounded-xl flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
                    <item.icon className="text-primary-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-400 mb-1">{item.title}</h4>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white hover:text-primary-400 transition-colors text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-white text-sm">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="glass-card p-5 rounded-xl">
                <h4 className="font-medium text-sm text-gray-400 mb-3">Follow Me</h4>
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-600/20 hover:border-primary-500/50 transition-all"
                      aria-label={label}
                    >
                      <Icon size={18} className="text-gray-400" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Note */}
              <div className="glass-card p-5 rounded-xl bg-primary-500/5 border-primary-500/20">
                <p className="text-gray-300 text-sm leading-relaxed">
                  <strong className="text-primary-400">Pro tip:</strong> Include as much 
                  detail about your project as possible — budget range, timeline, and 
                  specific requirements help me give you the best response.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              {...fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-2xl">
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
                    />
                  </div>
                </div>
                <div className="mb-5">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Project inquiry - Automation setup"
                    className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Tell me about your project, goals, and timeline..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-400/50 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition-all text-sm resize-none"
                  />
                </div>

                {status.message && (
                  <div
                    className={`mb-5 p-4 rounded-xl flex items-center gap-3 text-sm ${
                      status.type === 'success'
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                    }`}
                  >
                    {status.type === 'success' ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {status.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map / Additional CTA */}
      <section className="section-padding bg-dark-600/20">
        <div className="container-custom mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">
              Prefer a quick <span className="highlight-text">chat?</span>
            </h2>
            <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
              Feel free to reach out directly via email for a faster response.
            </p>
            <a
              href="mailto:afshanmursaleen1@gmail.com"
              className="btn-outline text-base"
            >
              <Mail size={18} />
              afshanmursaleen1@gmail.com
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
