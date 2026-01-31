import cn from 'classnames'
import Vercel from './Vercel'
import { useConfig } from '../lib/config'

const Footer = ({ fullWidth, className }) => {
  const BLOG = useConfig()

  const d = new Date()
  const y = d.getFullYear()
  const from = +BLOG.since
  return (
    <div
      className={cn(
        'mt-6 flex-shrink-0 m-auto w-full text-neutral-500 transition-all',
        className
      )}
    >
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="my-4 text-sm leading-6">
        <div className="flex align-baseline justify-between flex-wrap">
          <p>
            © {BLOG.author} - {y}
          </p>
          <Vercel />
        </div>
      </div>
    </div>
  )
}

export default Footer
