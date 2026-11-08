import { useState } from 'react'
import { Card, Button, ConfirmDialog, EmptyState } from '../../design-system'

const PERSONA = {
  fullName: 'Иванов Алексей Сергеевич',
  shortName: 'Алексей',
  initials: 'АС',
  idNumber: '1140390A012PB8',
  birthDate: '14.03.1990',
  citizenship: 'Республика Беларусь',
  address: '220030, г. Минск, ул. Карла Маркса, д. 14, кв. 27',
  phone: '+375 29 555-12-34',
  email: 'a.ivanov@example.by',
}

export function ProfilePage() {
  const [confirmBlock, setConfirmBlock] = useState(false)

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Личный кабинет</h1>
        <p className="text-muted">Сведения о вас из регистра населения. Только просмотр.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка: Аватар */}
        <Card className="md:col-span-1 flex flex-col items-center text-center p-6 h-fit">
          <div className="w-24 h-24 bg-navy text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4">
            {PERSONA.initials}
          </div>
          <h2 className="text-xl font-bold text-navy-deep mb-1">{PERSONA.fullName}</h2>
          <p className="text-sm text-muted mb-6">Гражданин РБ</p>
        </Card>

        {/* Правая колонка: Данные */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <h3 className="text-lg font-bold text-navy-deep mb-6 border-b border-line pb-2">
              Персональные данные
            </h3>
            <dl className="space-y-4 text-[15px]">
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Личный номер</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.idNumber}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Дата рождения</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.birthDate}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Гражданство</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.citizenship}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Адрес</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.address}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-navy-deep mb-6 border-b border-line pb-2">
              Контакты
            </h3>
            <dl className="space-y-4 text-[15px]">
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Телефон</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.phone}</dd>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="col-span-2 font-semibold text-ink">{PERSONA.email}</dd>
              </div>
            </dl>
          </Card>

          {/* Сертификаты (пустое состояние) */}
          <Card>
            <h3 className="text-lg font-bold text-navy-deep mb-4">Сертификаты</h3>
            <EmptyState
              title="У вас пока нет сертификатов"
              description="Здесь будут отображаться ваши электронные подписи и ключи доступа."
            />
          </Card>

          {/* Опасная зона (эвристика #5) */}
          <Card className="border-danger/30 bg-[#fffbfa]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-navy-deep mb-1">Блокировка уникального идентификатора (УИ)</h3>
                <p className="text-sm text-muted">
                  Временно заблокирует вход и оказание услуг. Разблокировка — только в службе "Одно окно".
                </p>
              </div>
              <Button
                variant="ghost"
                className="text-danger border-danger hover:bg-[#fff6f6] shrink-0"
                onClick={() => setConfirmBlock(true)}
              >
                Заблокировать УИ
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmBlock}
        title="Заблокировать УИ?"
        description="После блокировки вы не сможете получать услуги и входить в кабинет до разблокировки в отделении. Продолжить?"
        confirmLabel="Заблокировать"
        isDanger
        onConfirm={() => {
          setConfirmBlock(false)
          // TODO: вызов API
        }}
        onCancel={() => setConfirmBlock(false)}
      />
    </div>
  )
}