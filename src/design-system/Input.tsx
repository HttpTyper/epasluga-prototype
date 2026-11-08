import type { InputHTMLAttributes, Ref } from 'react'
import clsx from 'clsx'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  isError?: boolean
  ref?: Ref<HTMLInputElement>
}

export function Input({ isError, className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-control border px-3 py-2.5 text-[15px] outline-none transition-shadow',
        isError
          ? 'border-danger bg-[#fff6f6] focus:ring-2 focus:ring-danger/20'
          : 'border-line bg-white focus:border-navy focus:ring-4 focus:ring-navy/12',
        className,
      )}
      {...props}
    />
  )
}