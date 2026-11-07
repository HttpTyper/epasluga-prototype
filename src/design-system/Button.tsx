import type { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-navy/20 disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-navy text-white hover:bg-navy-deep border border-transparent',
        variant === 'ghost' && 'bg-white text-navy border border-navy hover:bg-soft',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}