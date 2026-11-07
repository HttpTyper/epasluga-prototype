import { Card } from '../../design-system'

const situations = [
  { title: 'Родился ребенок', icon: '👶' },
  { title: 'Купил авто', icon: '🚗' },
  { title: 'Смена работы', icon: '💼' },
  { title: 'Покупка недвижимости', icon: '🏠' },
]

export function LifeSituations() {
  return (
    <div>
      <h2 className="text-lg font-bold text-navy-deep mb-4">Жизненные ситуации</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {situations.map(sit => (
          <Card key={sit.title} variant="interactive" className="items-center text-center justify-center p-6 gap-3">
            <span className="text-4xl">{sit.icon}</span>
            <span className="font-semibold text-navy-deep text-sm">{sit.title}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}