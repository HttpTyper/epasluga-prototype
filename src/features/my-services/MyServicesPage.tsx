import { useApplications } from '../../lib/applications'
import { services } from '../../data/services'
import { statusHelp } from '../../lib/format'
import { downloadDemoPdf } from '../../lib/download'
import { MyServicesRow } from './MyServicesRow'

export function MyServicesPage() {
  const { apps, update } = useApplications()

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Мои услуги</h1>
        <p className="text-muted max-w-2xl">
          Заявления, которые вы начали или отправили. Быстрые действия — прямо в таблице.
        </p>
      </header>

      <div className="bg-white border border-line rounded-card overflow-x-auto">
        <table className="w-full text-left text-sm responsive-table">
          <thead className="bg-soft text-muted text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold">Услуга</th>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
              <th className="px-4 py-3 font-semibold text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {apps.map((app) => {
              const svc = services.find((s) => s.id === app.serviceId)
              return (
                <MyServicesRow
                  key={app.id}
                  app={app}
                  href={svc ? `/service/${svc.id}` : null}
                  onPay={() => update(app.id, { status: 'Выполнено' })}
                  onDownload={() => downloadDemoPdf(app)}
                  help={statusHelp(app.status)}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}