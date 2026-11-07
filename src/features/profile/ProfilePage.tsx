import { Card, Button } from '../../design-system'

export function ProfilePage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-navy-deep mb-8">Личный кабинет</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка: Аватар и данные */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 h-fit">
          <div className="w-24 h-24 bg-soft rounded-full flex items-center justify-center text-3xl font-bold text-navy mb-4">
            ИИ
          </div>
          <h2 className="text-xl font-bold text-navy-deep mb-1">Иванов Иван</h2>
          <p className="text-sm text-muted mb-6">ivanov@mail.com</p>
          <Button variant="ghost" className="w-full">Редактировать профиль</Button>
        </Card>

        {/* Правая колонка: Данные */}
        <Card className="md:col-span-2">
          <h3 className="text-lg font-bold text-navy-deep mb-6 border-b border-line pb-2">Ваши данные</h3>
          <dl className="space-y-4 text-[15px]">
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Номер телефона</dt>
              <dd className="col-span-2 font-semibold text-ink">+375 29 123-45-67</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">ID-карта</dt>
              <dd className="col-span-2 font-semibold text-ink">Активна (привязана)</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Дата регистрации</dt>
              <dd className="col-span-2 font-semibold text-ink">1 января 2024</dd>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <dt className="text-muted">Уведомления</dt>
              <dd className="col-span-2 font-semibold text-ok">Email и Push включены</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}