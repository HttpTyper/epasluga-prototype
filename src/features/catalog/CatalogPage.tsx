import { useState } from 'react'
import { mockServices } from '../../lib/api/mocks/fixtures/services'
import { CatalogCard } from './CatalogCard'
import clsx from 'clsx'

export function CatalogPage() {
  const [viewMode, setViewMode] = useState<'situations' | 'departments'>('situations')

  // Группируем данные в зависимости от выбранного режима
  const groupedData = mockServices.reduce((acc, service) => {
    const key = viewMode === 'situations' ? (service.situation || 'Другое') : service.category
    if (!acc[key]) acc[key] = []
    acc[key].push(service)
    return acc
  }, {} as Record<string, typeof mockServices>)

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-navy-deep mb-2">Каталог услуг</h1>
      <p className="text-muted mb-8">Найдите нужную услугу по вашей задаче или по ведомству.</p>

      {/* Переключатель режимов (п. #2 из таблицы) */}
      <div className="flex gap-2 mb-8 bg-soft p-1 rounded-full w-fit">
        <button
          onClick={() => setViewMode('situations')}
          className={clsx(
            'px-6 py-2.5 rounded-full text-sm font-semibold transition-colors',
            viewMode === 'situations' ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-navy'
          )}
        >
          По жизненным ситуациям
        </button>
        <button
          onClick={() => setViewMode('departments')}
          className={clsx(
            'px-6 py-2.5 rounded-full text-sm font-semibold transition-colors',
            viewMode === 'departments' ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-navy'
          )}
        >
          По ведомствам
        </button>
      </div>

      {/* Сетка с группами */}
      <div className="space-y-10">
        {Object.entries(groupedData).map(([groupName, services]) => (
          <section key={groupName}>
            <h2 className="text-xl font-bold text-navy-deep mb-4 flex items-center gap-2">
              {viewMode === 'situations' && <span className="w-2 h-6 bg-accent rounded-full"></span>}
              {groupName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(service => (
                <CatalogCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}