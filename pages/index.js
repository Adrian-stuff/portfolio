import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Mail, Linkedin } from 'lucide-react'
import Container from '@/components/Container'

export async function getStaticProps() {
  const posts = await getAllPosts({ includePages: false })
  const shownPosts = posts.filter(post => post.status?.[0] === 'Published' && post.type?.[0] === 'Post')
  return {
    props: {
      posts: shownPosts
    },
    revalidate: 1
  }
}

export default function Portfolio({ posts }) {
  const { title, author, description } = useConfig()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 50 }
    }
  }

  return (
    <Container title={title} description={description}>
        
        <div className="mb-24 md:mb-32">
           <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl font-light leading-relaxed mt-8">
            {description}
          </p>
            
            <div className="flex gap-6 mt-8 text-neutral-400">
            <a href="mailto:deveraadrian46@gmail.com" className="hover:text-neutral-900 transition-colors">
              <Mail size={24} strokeWidth={1.5} />
            </a>
            <a href="https://github.com/adrian-stuff" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">
              <Github size={24} strokeWidth={1.5} />
            </a>
            <a href="https://www.linkedin.com/in/adrian-de-vera-a96982369/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">
              <Linkedin size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Selected Work */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-baseline justify-between mb-12 border-b border-neutral-200 pb-4">
            <h2 className="text-sm font-medium tracking-widest text-neutral-400 uppercase">Selected Work</h2>
            <span className="text-sm text-neutral-400">{posts.length} Items</span>
          </div>

          <div className="grid gap-12 md:gap-16">
            {posts.map((post) => (
              <motion.article 
                key={post.id} 
                variants={itemVariants}
                className="group relative"
              >
                <Link href={`/${post.slug}`} legacyBehavior>
                  <a className="block group-hover:opacity-90 transition-opacity">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 md:gap-8">
                      <h3 className="text-2xl md:text-3xl font-light leading-tight group-hover:underline decoration-1 underline-offset-4">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center gap-2 text-neutral-400 shrink-0">
                        <span className="text-sm font-light italic">
                           {new Date(post.date?.start_date || post.createdTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                        </span>
                        <ArrowUpRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                    
                    {post.summary && (
                      <p className="mt-4 text-neutral-500 text-lg font-light leading-relaxed max-w-xl">
                        {post.summary}
                      </p>
                    )}

                    {post.tags && (
                      <div className="flex gap-3 mt-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs text-neutral-400 border border-neutral-200 px-2 py-1 rounded-full bg-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </a>
                </Link>
              </motion.article>
            ))}
          </div>
        </motion.section>
    </Container>
  )
}
