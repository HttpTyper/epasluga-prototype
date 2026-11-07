import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'

type TooltipProps = {
  text: string
  children: ReactNode
}

export function Tooltip({ text, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const show = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.top - 8, // чуть выше элемента
        left: rect.left + rect.width / 2,
      })
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
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-soft text-navy text-xs font-bold cursor-help focus:outline-none focus:ring-2 focus:ring-navy/50"
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          className="fixed z-50 bg-[#1c1c28] text-white text-xs px-2.5 py-1.5 rounded-md pointer-events-none max-w-[240px] -translate-x-1/2 -translate-y-full"
          style={{ top: coords.top, left: coords.left }}
        >
          {text}
        </div>
      )}
    </>
  )
}