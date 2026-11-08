import { Link } from 'react-router-dom'
import { Card } from '../../design-system'
import { services } from '../../data/services'

// Явный список «быстрых действий» для молодого пользователя (эвристика #8):
// самое частое — справка о доходах, паспорт, регистрация авто.
const QUICK_IDS = ['3-05-03', '200-12-1', '200-15-11']

export function QuickActions() {
  const quickServices = QUICK_IDS.map((id) => services.find((s) => s.id === id)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  )

  return (
    <div>
      <h2 className="text-lg font-bold text-navy-deep mb-4">Быстрые действия для вас</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickServices.map((service) => (
          <Link key={service.id} to={`/service/${service.id}`} className="block h-full">
            <Card variant="interactive" className="h-full">
              <h3 className="font-semibold text-navy mb-2 leading-tight">{service.shortTitle}</h3>
              <p className="text-sm text-muted flex-1 line-clamp-2">{service.plainDescription}</p>
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