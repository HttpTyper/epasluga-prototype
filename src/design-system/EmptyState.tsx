import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 bg-white border border-dashed border-line rounded-card">
      {icon && <div className="text-navy mb-4 [&>svg]:w-12 [&>svg]:h-12">{icon}</div>}
      <h3 className="text-lg font-bold text-navy-deep mb-2">{title}</h3>
      {description && <p className="text-sm text-muted max-w-md mb-6">{description}</p>}
      {action}
    </div>
  )
}