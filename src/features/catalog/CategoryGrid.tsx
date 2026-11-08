import { Link } from 'react-router-dom'
import type { Category } from '../../types/service'
import type { JSX } from 'react/jsx-runtime'

const ICONS: Record<string, JSX.Element> = {
  star: <path d="m12 4 2.1 4.4 4.9.7-3.5 3.4.8 4.9L12 15.5 7.7 17.4l.8-4.9L5 9.1l4.9-.7L12 4Z" />,
  brief: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="2" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1M4 13h16" />
    </>
  ),
  file: <path d="M7 4h7l5 5v11H7V4ZM14 4v5h5" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19" />
    </>
  ),
  id: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M13 11h5M13 14h4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4-4" />
    </>
  ),
  home: <path d="m4 11 8-7 8 7v9H4v-9Z" />,
  wallet: (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <circle cx="16" cy="13" r="1.2" fill="currentColor" />
    </>
  ),
  folder: <path d="M4 7h6l2 2h8v10H4V7Z" />,
  car: (
    <>
      <path d="M5 16h14l-1-5H6l-1 5Z" />
      <circle cx="8" cy="16" r="1" />
      <circle cx="16" cy="16" r="1" />
    </>
  ),
  check: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="m8 12 2.5 2.5L16 9" />
    </>
  ),
}

function CategoryIcon({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-soft text-navy mb-3">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ICONS[name] ?? ICONS.file}
      </svg>
    </span>
  )
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {categories.map((c) => (
        <Link
          key={c.id}
          to={`/catalog?cat=${c.id}&view=list`}
          className="bg-white border border-line rounded-card p-4 flex flex-col shadow-card transition-all hover:border-navy hover:-translate-y-px"
        >
          <CategoryIcon name={c.icon} />
          <strong className="text-navy-deep text-[15px] mb-1">{c.title}</strong>
          <p className="text-sm text-muted m-0">{c.desc}</p>
        </Link>
      ))}
    </div>
  )
}