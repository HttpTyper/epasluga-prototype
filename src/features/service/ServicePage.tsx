import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { services } from '../../data/services'
import { Button, Badge, Card, Accordion } from '../../design-system'
import { ru } from '../../content/ru'
import { ApplicationForm } from './ApplicationForm'

const AUTH_HINT: Record<string, string> = {
  none: 'Понадобится только ваше имя.',
  id: 'Понадобится ID-карта и PIN-код.',
  ecp: 'Понадобится ID-карта и электронная подпись (ЭЦП).',
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
      {/* Хлебные крошки */}
      <div className="text-sm text-muted mb-6 flex gap-2 flex-wrap">
        <Link to="/catalog" className="hover:text-navy">
          Каталог
        </Link>
        <span>/</span>
        <Link to={`/catalog?cat=${service.category}&view=list`} className="hover:text-navy">
          {service.categoryTitle}
        </Link>
        <span>/</span>
        <span className="text-ink">{service.shortTitle}</span>
      </div>

      {/* Заголовок + бейджи */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-deep mb-2">{service.shortTitle}</h1>
          <div className="flex flex-wrap gap-1.5 items-center">
            {service.authLevel === 'id' && <Badge variant="need-id">Нужна ID-карта</Badge>}
            {service.authLevel === 'ecp' && <Badge variant="ecp">Нужна ЭЦП</Badge>}
            {service.authLevel === 'none' && <Badge variant="accent">Без ID-карты</Badge>}
            <Badge variant="code">{service.code}</Badge>
            <span className="text-sm text-muted">· {service.orgName}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-bold text-navy-deep mb-3">Что это</h2>
            <p className="text-ink leading-relaxed">{service.plainDescription}</p>
          </section>

          {/* «Что вы получите» */}
          <section className="bg-[#f8f9ff] border border-line rounded-card p-6">
            <h2 className="text-lg font-bold text-navy-deep mb-5">{ru.service.resultTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-navy">⏱ {ru.service.timeLabel}</span>
                <span className="text-lg font-bold text-ink">{service.timeToComplete}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-navy">💰 {ru.service.costLabel}</span>
                <span className="text-lg font-bold text-ink">{service.cost}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-navy">📄 {ru.service.formatLabel}</span>
                <span className="text-lg font-bold text-ink">{service.format}</span>
              </div>
            </div>
          </section>

          {/* Как это работает */}
          <section>
            <h2 className="text-lg font-bold text-navy-deep mb-3">Как это работает</h2>
            <ol className="bg-white border border-line rounded-card divide-y divide-line">
              {service.steps.map((step, i) => (
                <li key={i} className="flex gap-3 p-4">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-soft text-navy text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-[15px] text-ink">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Полное официальное название — скрыто в аккордеон (эвристика #2) */}
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

        {/* Правая колонка — sticky */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card className="bg-navy text-white border-0 shadow-lg">
              <h3 className="text-lg font-bold mb-2 text-white">Готовы оформить?</h3>
              <p className="text-white/80 text-sm mb-5">{AUTH_HINT[service.authLevel]}</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-white text-navy hover:bg-soft border-0"
              >
                {ru.service.orderButton}
              </Button>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-muted uppercase tracking-wider mb-3">
                Ведомство
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