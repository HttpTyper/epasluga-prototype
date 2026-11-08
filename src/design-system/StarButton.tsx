import { clsx } from 'clsx'

type StarButtonProps = {
  active: boolean
  onClick: () => void
  label?: string
}

export function StarButton({ active, onClick, label }: StarButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      aria-pressed={active}
      aria-label={label ?? (active ? 'Убрать из избранного' : 'Добавить в избранное')}
      className={clsx(
        'shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-all',
        'focus:outline-none focus:ring-2 focus:ring-navy/40',
        active ? 'text-navy bg-soft' : 'text-muted hover:text-navy hover:bg-soft',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5 transition-transform duration-150"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={active ? 0 : 1.8}
        style={{ transform: active ? 'scale(1.1)' : 'scale(1)' }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m12 4 2.1 4.4 4.9.7-3.5 3.4.8 4.9L12 15.5 7.7 17.4l.8-4.9L5 9.1l4.9-.7L12 4Z"
        />
      </svg>
    </button>
  )
}