import { motion } from 'framer-motion'

export default function SectionTitle({ title, highlight, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <h2 className="text-3xl md:text-5xl font-bold font-display">
        {title}{' '}
        <span className="highlight-text">{highlight}</span>
      </h2>
      {subtitle && (
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  )
}
