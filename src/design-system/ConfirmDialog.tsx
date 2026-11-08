import { useEffect } from 'react'
import { Button } from './Button'

type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDanger?: boolean
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Отмена',
  onConfirm,
  onCancel,
  isDanger = false,
}: ConfirmDialogProps) {
  // Закрытие по Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-[#14163c]/50 flex items-center justify-center p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="bg-white rounded-card p-6 max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-title" className="text-lg font-bold text-navy-deep mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted mb-6">{description}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold text-white ${
              isDanger ? 'bg-danger hover:bg-[#8e1c13]' : 'bg-navy hover:bg-navy-deep'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}