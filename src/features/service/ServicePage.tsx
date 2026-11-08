import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { services } from '../../data/services'
import { Button, Badge, Card, Accordion, Tooltip } from '../../design-system'
import { ru } from '../../content/ru'
import { ApplicationForm } from './ApplicationForm'

const AUTH_HINT: Record<string, React.ReactNode> = {
  none: 'Понадобится только ваше имя.',
  id: 'Понадобится ID-карта и PIN-код.',
  ecp: (
    <span>
      Понадобится ID-карта и <Tooltip text="Электронная цифровая подпись. Выдается в РУЦ ГосСУОК.">ЭЦП</Tooltip>.
    </span>
  ),
}

export function ServicePage() {
  const { id } = useParams()
  const service = services.find((s) => s.id === id)
  const [isFormOpen, setIsFormOpen] = useState(false)

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-navy-deep mb-4">Услуга не найдена</h1>
        <Link to="/catalog" className="text-navy hover:underline">
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  if (isFormOpen) {
    return <ApplicationForm service={service} onBack={() => setIsFormOpen(false)} />
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Шапка с заголовком */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-3">{service.shortTitle}</h1>
        <div className="flex flex-wrap gap-2 items-center">
          {service.authLevel === 'id' && <Badge variant="need-id">Нужна ID-карта</Badge>}
          {service.authLevel === 'ecp' && <Badge variant="ecp">Нужна ЭЦП</Badge>}
          {service.authLevel === 'none' && <Badge variant="accent">Без ID-карты</Badge>}
          <Badge variant="code">{service.code}</Badge>
          <span className="text-sm text-muted">· {service.orgName}</span>
        </div>
      </div>

      {/* Сетка: контент + сайдбар (на мобильных сайдбар уходит в самый низ) */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
        
        {/* Левая колонка (Основная информация) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Что это */}
          <section>
            <h2 className="text-lg font-bold text-navy-deep mb-3">Что это</h2>
            <p className="text-ink leading-relaxed text-[16px]">{service.plainDescription}</p>
          </section>

          {/* 2. Что вы получите */}
          <section className="bg-[#f8f9ff] border border-line rounded-card p-6">
            <h2 className="text-lg font-bold text-navy-deep mb-5">{ru.service.resultTitle}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-navy">⏱ {ru.service.timeLabel}</span>
                <span className="text-base md:text-lg font-bold text-ink">{service.timeToComplete}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-navy">💰 {ru.service.costLabel}</span>
                <span className="text-base md:text-lg font-bold text-ink">{service.cost}</span>
              </div>
              <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                <span className="text-sm font-semibold text-navy">📄 {ru.service.formatLabel}</span>
                <span className="text-base md:text-lg font-bold text-ink">{service.format}</span>
              </div>
            </div>
          </section>

          {/* 3. Как это работает */}
          <section>
            <h2 className="text-lg font-bold text-navy-deep mb-3">Как это работает</h2>
            <ol className="bg-white border border-line rounded-card divide-y divide-line">
              {service.steps.map((step, i) => (
                <li key={i} className="flex gap-3 p-4">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-soft text-navy text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-ink leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* 4. Официальное название (скрыто в аккордеон) */}
          <Accordion title="Официальное название и правовая база">
            <p className="text-sm text-muted mb-2">
              <span className="font-semibold text-ink">Код услуги:</span> {service.code}
            </p>
            <p className="text-sm text-muted mb-2">
              <span className="font-semibold text-ink">Полное наименование:</span>{' '}
              {service.officialTitle}
            </p>
            <p className="text-sm text-muted">
              <span className="font-semibold text-ink">Ведомство:</span> {service.orgName} (УНП{' '}
              {service.orgUnp})
            </p>
          </Accordion>
        </div>

        {/* Правая колонка (Сайдбар с действием) */}
        {/* На мобильных мы хотим, чтобы он был внизу, поэтому убираем sticky на мобильных */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            
            {/* Кнопка Заказать (спокойная, не агрессивная) */}
            <Card className="bg-navy text-white border-0 shadow-lg">
              <h3 className="text-lg font-bold mb-2 text-white">Оформление</h3>
              <p className="text-white/80 text-sm mb-5 leading-relaxed">{AUTH_HINT[service.authLevel]}</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white! text-navy! hover:bg-soft! border-0 font-bold"
              >
                {ru.service.orderButton}
              </Button>
            </Card>

            {/* Ведомство (под кнопкой) */}
            <Card>
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
                Кто оказывает услугу
              </h3>
              <div className="font-semibold text-navy-deep mb-1">{service.orgName}</div>
              <div className="text-sm text-muted">УНП: {service.orgUnp}</div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}