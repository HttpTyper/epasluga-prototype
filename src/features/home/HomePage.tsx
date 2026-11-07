import { Button, Card, Badge, Input, Tooltip, Accordion, StatusTracker } from '../../design-system'

export function HomePage() {
  return (
    <div className="space-y-8 max-w-3xl">
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
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
          Заголовок с подсказкой <Tooltip text="Это всплывающая подсказка, которая помогает понять сложный термин.">?</Tooltip>
        </h2>
        <p className="text-muted mb-4">Наведите мышку на знак вопроса.</p>
        <Input placeholder="Введите что-нибудь..." />
      </Card>

      <div>
        <h2 className="text-lg font-bold mb-4">Аккордеон (спойлер)</h2>
        <Accordion title="Что такое Е-Паслуга?">
          Это единый портал, где можно получить государственные услуги онлайн.
        </Accordion>
        <Accordion title="Как войти в личный кабинет?">
          Для входа понадобится ID-карта и PIN-код.
        </Accordion>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-12">Статус заявления</h2>
        <StatusTracker currentStep="processing" />
      </div>
    </div>
  )
}