import { Card, Button, Input } from '../../design-system'

export function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-navy-deep mb-2">Поддержка</h1>
      <p className="text-muted mb-8">Мы поможем, даже если вы не можете войти в кабинет.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Форма обратной связи (п. #9 аудита) */}
        <div>
          <Card>
            <h2 className="text-lg font-bold text-navy-deep mb-4">Задать вопрос</h2>
            <p className="text-sm text-muted mb-4">Работает без авторизации. Ответим на email в течение дня.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ваш email</label>
                <Input placeholder="example@mail.com" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Опишите проблему</label>
                <textarea 
                  className="w-full rounded-control border border-line px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/12 min-h-25"
                  placeholder="Например: не приходит SMS с кодом..."
                />
              </div>
              <Button className="w-full">Отправить обращение</Button>
            </div>
          </Card>
        </div>

        {/* Контакты (сделаны крупнее) */}
        <div className="space-y-4">
          <Card className="bg-soft border-line">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Горячая линия</h3>
            <p className="text-2xl font-bold text-navy-deep mb-1">8 (017) 123-45-67</p>
            <p className="text-sm text-muted">Ежедневно с 8:00 до 20:00</p>
          </Card>
          
          <Card className="bg-soft border-line">
            <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-2">Email поддержки</h3>
            <p className="text-xl font-bold text-navy-deep mb-1">help@epasluga.by</p>
            <p className="text-sm text-muted">Круглосуточно</p>
          </Card>
        </div>
      </div>
    </div>
  )
}