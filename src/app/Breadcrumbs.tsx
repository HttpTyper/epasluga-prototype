import { Link } from 'react-router-dom'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'

export function Breadcrumbs() {
  const crumbs = useBreadcrumbs()

  // На главной не показываем
  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Хлебные крошки" className="text-sm text-muted mb-6 flex flex-wrap items-center gap-1.5">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {c.href && !isLast ? (
              <Link to={c.href} className="hover:text-navy transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-ink font-medium' : ''}>{c.label}</span>
            )}
            {!isLast && <span className="text-line">/</span>}
          </span>
        )
      })}
    </nav>
  )
}