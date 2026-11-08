import { Link } from 'react-router-dom'
import { Badge } from '../../design-system'
import type { Application } from '../../types/service'
import { formatWhen, statusClass } from '../../lib/format'

type MyServicesRowProps = {
  app: Application
  href: string | null
  onPay: () => void
  onDownload: () => void // <-- добавили
  help: string
}

export function MyServicesRow({ app, href, onPay, onDownload, help }: MyServicesRowProps) {
  return (
    <tr>
      <td className="px-4 py-3 align-top">
        <div className="font-semibold text-navy-deep">{app.title}</div>
        <div className="text-xs text-muted mt-0.5">№ {app.num}</div>
      </td>
      <td className="px-4 py-3 align-top whitespace-nowrap text-muted">{formatWhen(app.at)}</td>
      <td className="px-4 py-3 align-top">
        <Badge className={statusClass(app.status)}>{app.status}</Badge>
        {help && <div className="text-xs text-muted mt-1 max-w-xs">{help}</div>}
        {app.comment && <div className="text-xs text-danger mt-1 max-w-xs">{app.comment}</div>}
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-col gap-2 items-end">
          {app.status === 'Выполнено' && (
            <button 
              type="button" 
              onClick={onDownload}
              className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep transition-colors w-full sm:w-auto"
            >
              Скачать
            </button>
          )}
          {app.status === 'Ожидает оплаты' && (
            <button 
              type="button" 
              onClick={onPay} 
              className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold bg-navy text-white hover:bg-navy-deep transition-colors w-full sm:w-auto"
            >
              Оплатить
            </button>
          )}
          {href && (app.status === 'Черновик' || app.status === 'На проверке') && (
            <Link 
              to={href} 
              className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold border border-navy text-navy hover:bg-soft transition-colors w-full sm:w-auto"
            >
              Открыть
            </Link>
          )}
          {/* Кнопка "Статус" для всех заявок */}
          <Link 
            to={`/status/${app.id}`} 
            className="inline-flex items-center justify-center rounded-control px-4 min-h-11 text-sm font-semibold border border-line text-muted hover:text-navy hover:border-navy transition-colors w-full sm:w-auto"
          >
            Детали
          </Link>
        </div>
      </td>
    </tr>
  )
}