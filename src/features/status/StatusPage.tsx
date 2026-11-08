import { useParams, Link } from 'react-router-dom'
import { useApplications } from '../../lib/applications'
import { services } from '../../data/services'
import { StatusTracker, Card, Badge } from '../../design-system'
import { formatWhen, statusClass } from '../../lib/format'

export function StatusPage() {
  const { id } = useParams()
  const { apps } = useApplications()

  // Если id не передан — показываем список (или редиректим в /apps)
  if (!id) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-navy-deep mb-4">Выберите заявление</h1>
        <p className="text-muted mb-6">Чтобы увидеть статус, перейдите в «Мои услуги» и выберите заявку.</p>
        <Link to="/apps" className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep">
          Перейти в Мои услуги
        </Link>
      </div>
    )
  }

  const app = apps.find((a) => a.id === id)
  const service = services.find((s) => s.id === app?.serviceId)

  if (!app) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-navy-deep mb-4">Заявление не найдено</h1>
        <Link to="/apps" className="text-navy hover:underline">Вернуться к списку</Link>
      </div>
    )
  }

  // Маппинг статусов приложения на шаги трекера
  const trackerStep = 
    app.status === 'Выполнено' ? 'ready' : 
    app.status === 'На проверке' ? 'processing' : 
    'submitted'

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="mb-8">
        <div className="text-sm text-muted mb-2">Заявление № {app.num} от {formatWhen(app.at)}</div>
        <h1 className="text-3xl font-bold text-navy-deep mb-2">{app.title}</h1>
        <p className="text-muted">Инициатор: {app.initiator}</p>
      </div>

      <Card className="mb-6">
        <h2 className="text-lg font-bold text-navy-deep mb-6">Текущий статус</h2>
        
        {/* Трекер шагов */}
        <div className="mb-8 pl-2">
          <StatusTracker currentStep={trackerStep} />
        </div>

        <div className="bg-soft rounded-card p-4 flex items-start gap-3">
          <div className="mt-0.5">
            <Badge className={statusClass(app.status)}>{app.status}</Badge>
          </div>
          <div>
            <p className="text-sm font-semibold text-navy-deep mb-1">
              {app.status === 'На проверке' && 'Ведомство рассматривает ваше заявление.'}
              {app.status === 'Выполнено' && 'Услуга оказана. Документ готов.'}
              {app.status === 'Ожидает оплаты' && 'Заявление одобрено, но требует оплаты.'}
              {app.status === 'Отказано' && 'Ведомство отказало в оказании услуги.'}
              {app.status === 'Отозвано' && 'Вы отозвали заявление.'}
              {app.status === 'Черновик' && 'Заявление ещё не отправлено.'}
            </p>
            <p className="text-sm text-muted">
              {app.comment || 'Дополнительные комментарии отсутствуют.'}
            </p>
          </div>
        </div>
      </Card>

      {service && (
        <Card>
          <h2 className="text-lg font-bold text-navy-deep mb-4">Об услуге</h2>
          <p className="text-sm text-muted mb-4">{service.plainDescription}</p>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-muted block">Срок по регламенту</span>
              <span className="font-semibold text-ink">{service.timeToComplete}</span>
            </div>
            <div>
              <span className="text-muted block">Стоимость</span>
              <span className="font-semibold text-ink">{service.cost}</span>
            </div>
          </div>
          <Link to={`/service/${service.id}`} className="text-sm font-semibold text-navy hover:underline">
            Вернуться к описанию услуги →
          </Link>
        </Card>
      )}
    </div>
  )
}