import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'need-id' | 'ecp' | 'code' | 'accent'
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase',
        variant === 'default' && 'bg-soft text-navy',
        variant === 'need-id' && 'bg-[#fdecea] text-danger',
        variant === 'ecp' && 'bg-[#fff4e5] text-accent-warm',
        variant === 'code' && 'bg-soft text-muted font-semibold normal-case tracking-normal',
        variant === 'accent' && 'bg-[#e7f6f2] text-accent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}