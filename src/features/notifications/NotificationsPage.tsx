import { useState } from 'react'
import { EmptyState } from '../../design-system'
import { useNotifications } from '../../lib/notifications'
import { NotificationCard } from './NotificationCard'

type Box = 'in' | 'arch'

export function NotificationsPage() {
  const [box, setBox] = useState<Box>('in')
  const { items, archive, unarchive, remove } = useNotifications()

  const rows = items.filter((n) => (box === 'arch' ? n.archived : !n.archived))

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Мои уведомления</h1>
        <p className="text-muted max-w-2xl">
          Юридически значимые уведомления нельзя удалить — только в архив.
        </p>
      </header>

      <div className="flex gap-2 mb-5">
        <button
          type="button"
          onClick={() => setBox('in')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            box === 'in' ? 'bg-navy text-white' : 'bg-white text-navy border border-line hover:border-navy'
          }`}
        >
          Входящие
        </button>
        <button
          type="button"
          onClick={() => setBox('arch')}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
            box === 'arch' ? 'bg-navy text-white' : 'bg-white text-navy border border-line hover:border-navy'
          }`}
        >
          Архив
        </button>
      </div>

      {rows.length > 0 ? (
        <div className="bg-white border border-line rounded-card divide-y divide-line overflow-hidden">
          {rows.map((n) => (
            <NotificationCard
              key={n.id}
              n={n}
              box={box}
              onArchive={() => archive(n.id)}
              onUnarchive={() => unarchive(n.id)}
              onDelete={() => remove(n.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={box === 'arch' ? 'Архив пуст' : 'Нет входящих'}
          description={box === 'arch' ? 'Здесь будут уведомления, которые вы убрали с глаз.' : 'Мы пришлём уведомление, когда по заявлению что-то изменится.'}
        />
      )}
    </div>
  )
}