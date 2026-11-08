import type { AppNotification } from '../../types/service'
import { Badge } from '../../design-system'
import { formatWhen } from '../../lib/format'

type NotificationCardProps = {
  n: AppNotification
  box: 'in' | 'arch'
  onArchive: () => void
  onUnarchive: () => void
  onDelete: () => void
}

export function NotificationCard({ n, box, onArchive, onUnarchive, onDelete }: NotificationCardProps) {
  return (
    <article className="flex gap-3 p-4">
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${n.kind === 'legal' ? 'bg-[#fff4e5] text-accent-warm' : 'bg-[#e8eeff] text-navy'}`}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          {n.kind === 'legal' ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h7l5 5v11H7V4ZM14 4v5h5" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16ZM10 16a2 2 0 0 0 4 0" />
          )}
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <Badge variant={n.kind === 'legal' ? 'ecp' : 'default'}>
            {n.kind === 'legal' ? 'Юридически значимое' : 'Информационное'}
          </Badge>
          <span className="text-xs text-muted">{formatWhen(n.at)}</span>
        </div>
        <h3 className="font-semibold text-navy-deep mb-1">{n.title}</h3>
        <p className="text-sm text-muted mb-3">{n.body}</p>

        <div className="flex gap-2 flex-wrap">
          {box === 'in' ? (
            <button type="button" onClick={onArchive} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line text-navy hover:bg-soft">
              В архив
            </button>
          ) : (
            <button type="button" onClick={onUnarchive} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line text-navy hover:bg-soft">
              Вернуть во входящие
            </button>
          )}
          {n.kind === 'info' && box === 'in' && (
            <button type="button" onClick={onDelete} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-line text-danger hover:bg-[#fff6f6]">
              Удалить
            </button>
          )}
        </div>
      </div>
    </article>
  )
}