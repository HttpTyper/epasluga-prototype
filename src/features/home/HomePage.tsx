import { Card, Badge, Button } from '../../design-system'
import { mockServices } from '../../lib/api/mocks/fixtures/services'
import { ru } from '../../content/ru'

export function HomePage() {
  const service = mockServices[0] // Берем первую услугу (Справка о доходах)

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-navy-deep">Тест данных</h1>
      
      <Card>
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-navy-deep">{service.title}</h2>
          <Badge variant="need-id">{ru.service.needId}</Badge>
        </div>
        
        <p className="text-sm text-muted mb-4">{service.officialTitle}</p>
        <p className="mb-6">{service.description}</p>

        <div className="bg-soft p-4 rounded-control mb-6">
          <h3 className="font-semibold mb-2">{ru.service.resultTitle}</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted block text-xs">⏱ {ru.service.timeLabel}</span>
              <strong>{service.timeToComplete}</strong>
            </div>
            <div>
              <span className="text-muted block text-xs">💰 {ru.service.costLabel}</span>
              <strong>{service.cost}</strong>
            </div>
            <div>
              <span className="text-muted block text-xs">📄 {ru.service.formatLabel}</span>
              <strong>{service.format}</strong>
            </div>
          </div>
        </div>

        <Button className="w-full">{ru.service.orderButton}</Button>
      </Card>
    </div>
  )
}