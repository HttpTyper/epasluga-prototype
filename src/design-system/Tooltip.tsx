import { useState, useRef, type ReactNode } from 'react'
import clsx from 'clsx'

type TooltipProps = {
  text: string
  children: ReactNode
  className?: string
}

export function Tooltip({ text, children, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const show = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 })
      setIsVisible(true)
    }
  }

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={show}
        onBlur={() => setIsVisible(false)}
        tabIndex={0}
        // Убрали иконку «?» и сделали пунктирное подчеркивание
        className={clsx(
          "inline border-b border-dashed border-white/50 cursor-help focus:outline-none focus:ring-2 focus:ring-white/40",
          className
        )}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          role="tooltip"
          className="fixed z-50 bg-[#1c1c28] text-white text-xs px-3 py-2 rounded-lg pointer-events-none max-w-xs shadow-lg -translate-x-1/2 -translate-y-full"
          style={{ top: coords.top, left: coords.left }}
        >
          {text}
        </div>
      )}
    </>
  )
}