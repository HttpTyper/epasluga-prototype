import { useState, useEffect } from 'react'
import clsx from 'clsx'

type ToastProps = {
  message: string
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Анимация появления
    setIsVisible(true)
    
    // Автоматическое скрытие через 5 секунд
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Ждем окончания анимации исчезновения
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={clsx(
        'fixed top-20 right-6 max-w-sm bg-white border border-line rounded-card shadow-xl p-4 flex gap-3 z-50 transition-all duration-300',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
      )}
    >
      <div className="w-10 h-10 bg-[#e8eeff] text-navy rounded-full flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <div>
        <h4 className="font-bold text-navy-deep text-sm mb-1">Е-Паслуга</h4>
        <p className="text-sm text-ink">{message}</p>
      </div>
      <button onClick={onClose} className="absolute top-2 right-2 text-muted hover:text-ink">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}