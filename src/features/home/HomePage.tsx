import { Button, Card, Badge, Input } from '../../design-system'

export function HomePage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-navy-deep">Дизайн-система (Тест)</h1>
      
      <div className="space-x-4">
        <Button>Основная кнопка</Button>
        <Button variant="ghost">Второстепенная</Button>
      </div>

      <div className="space-x-2">
        <Badge>Обычный</Badge>
        <Badge variant="need-id">Нужна ID-карта</Badge>
        <Badge variant="ecp">ЭЦП</Badge>
        <Badge variant="code">Код: 3.05.03</Badge>
      </div>

      <Card>
        <h2 className="text-lg font-bold mb-2">Заголовок карточки</h2>
        <p className="text-muted mb-4">Это пример карточки из нашей новой дизайн-системы.</p>
        <Input placeholder="Введите что-нибудь..." />
      </Card>
    </div>
  )
}