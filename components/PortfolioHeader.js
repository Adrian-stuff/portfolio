import { useConfig } from '@/lib/config'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Mail, Linkedin } from 'lucide-react'

const PortfolioHeader = ({ isHome = false }) => {
  const { author } = useConfig()

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`mb-12 md:mb-24 pt-12 md:pt-16`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <Link href="/" legacyBehavior>
          <a className="hover:opacity-70 transition-opacity">
            <h1 className={`${isHome ? 'text-4xl md:text-6xl mb-6' : 'text-xl font-medium tracking-wide'} font-light tracking-tight`}>
              {author}
            </h1>
          </a>
        </Link>
        
        {!isHome && (
          <div className="flex gap-6 text-neutral-400">
            <a href="mailto:email@gmail.com" className="hover:text-neutral-900 transition-colors">
              <Mail size={20} strokeWidth={1.5} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">
              <Github size={20} strokeWidth={1.5} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
          </div>
        )}
      </div>
    </motion.header>
  )
}

export default PortfolioHeader
