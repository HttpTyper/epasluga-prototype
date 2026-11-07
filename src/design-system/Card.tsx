import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'interactive'
}

export function Card({ variant = 'default', className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-card border border-line rounded-card p-4 shadow-card flex flex-col',
        variant === 'interactive' && 'cursor-pointer transition-all hover:border-navy hover:-translate-y-px',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}