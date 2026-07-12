import { Link } from 'react-router-dom'
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react'

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Mail, href: 'mailto:afshanmursaleen1@gmail.com', label: 'Email' },
]

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Portfolio', path: '/portfolio' },
  { name: 'Contact', path: '/contact' },
]

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="border-t border-white/5 bg-dark-600/50">
      <div className="container-custom mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center font-bold text-lg">
                A
              </div>
              <span className="font-display font-bold text-lg">
                Afshan<span className="text-primary-400">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI Automation Expert specializing in n8n, Make.com, 
              Agentic AI, and SaaS development. Turning ideas into 
              intelligent, automated solutions.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-600/20 hover:border-primary-500/50 transition-all"
                  aria-label={label}
                >
                  <Icon size={18} className="text-gray-400" />
                </a>
              ))}
            </div>
            <p className="text-gray-400 text-sm">afshanmursaleen1@gmail.com</p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Afshan Mursaleen. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary-600/20 hover:border-primary-500/50 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} className="text-gray-400" />
          </button>
        </div>
      </div>
    </footer>
  )
}
