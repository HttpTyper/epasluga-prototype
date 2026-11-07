import { Link } from 'react-router-dom'
import { Card } from '../../design-system'
import { mockServices } from '../../lib/api/mocks/fixtures/services'

export function QuickActions() {
  // В реальности здесь была бы логика фильтрации по возрасту, пока берем первые 3
  const quickServices = mockServices.slice(0, 3)

  return (
    <div>
      <h2 className="text-lg font-bold text-navy-deep mb-4">Быстрые действия для вас</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickServices.map(service => (
          <Link key={service.id} to={`/service/${service.id}`} className="block h-full">
            <Card variant="interactive" className="h-full">
              <h3 className="font-semibold text-navy mb-2 leading-tight">{service.title}</h3>
              <p className="text-sm text-muted flex-1 line-clamp-2">{service.description}</p>
              <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs font-semibold text-navy">
                <span>{service.timeToComplete}</span>
                <span>Оформить →</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}