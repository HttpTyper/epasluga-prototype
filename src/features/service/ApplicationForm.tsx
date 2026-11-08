import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Card, Input } from '../../design-system'
import type { Service } from '../../types/service'
import { SuccessScreen } from './SuccessScreen'

// Схема валидации (эвристика #9 — понятные сообщения рядом с полем)
const PHONE_RE = /^\+375\s?\(?(?:17|25|29|33|44)\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/

const schema = z.object({
  lastName: z.string().trim().min(2, 'Укажите фамилию, минимум 2 буквы'),
  firstName: z.string().trim().min(2, 'Укажите имя, минимум 2 буквы'),
  middleName: z.string().trim().optional().or(z.literal('')),
  phone: z.string().trim().regex(PHONE_RE, 'Формат: +375 29 000-00-00'),
  email: z.string().trim().email('Похоже на неверный адрес').optional().or(z.literal('')),
  comment: z.string().max(500, 'Не больше 500 символов').optional().or(z.literal('')),
  consent: z.literal(true, {
    error: () => ({ message: 'Нужно согласие, чтобы отправить заявление' }),
  }),
})

type FormData = z.infer<typeof schema>

const DRAFT_PREFIX = 'epasluga-draft:'

function readDraft(id: string): Partial<FormData> | null {
  try {
    return JSON.parse(localStorage.getItem(DRAFT_PREFIX + id) || 'null')
  } catch {
    return null
  }
}

type ApplicationFormProps = {
  service: Service
  onBack: () => void
}

export function ApplicationForm({ service, onBack }: ApplicationFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null)
  const saveTimer = useRef<number | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      lastName: '',
      firstName: '',
      middleName: '',
      phone: '',
      email: '',
      comment: '',
    },
  })

  // Восстановление черновика при монтировании
  useEffect(() => {
    const saved = readDraft(service.id)
    if (saved) {
      reset(saved as FormData)
      setDraftSavedAt('черновик восстановлен')
    }
  }, [service.id, reset])

  // Автосохранение при любом изменении (эвристика #3)
  useEffect(() => {
    const sub = watch((values) => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
      saveTimer.current = window.setTimeout(() => {
        const draft = { ...values }
        // consent не сохраняем — пользователь должен явно поставить галочку
        delete draft.consent
        localStorage.setItem(DRAFT_PREFIX + service.id, JSON.stringify(draft))
        setDraftSavedAt(
          new Date().toLocaleTimeString('ru-BY', { hour: '2-digit', minute: '2-digit' }),
        )
      }, 400)
    })
    return () => {
      sub.unsubscribe()
      if (saveTimer.current) window.clearTimeout(saveTimer.current)
    }
  }, [watch, service.id])

  const onSubmit = async (data: FormData) => {
    // TODO шаг 5: записать в «Мои услуги» и уведомления
    console.info('application submitted', { serviceId: service.id, ...data })
    localStorage.removeItem(DRAFT_PREFIX + service.id)
    setIsSubmitted(true)
  }

  const onSaveAndExit = () => {
    const values = watch()
    localStorage.setItem(DRAFT_PREFIX + service.id, JSON.stringify(values))
    onBack()
  }

  if (isSubmitted) {
    return <SuccessScreen service={service} />
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-sm text-muted mb-6">
        <button type="button" onClick={onBack} className="hover:text-navy">
          ← Вернуться к описанию
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-deep mb-2">Заполнение заявления</h1>
        <p className="text-muted">{service.shortTitle}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold mb-1">
              Фамилия <span className="text-danger">*</span>
            </label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Иванов"
              isError={!!errors.lastName}
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" className="text-danger text-xs mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold mb-1">
              Имя <span className="text-danger">*</span>
            </label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Алексей"
              isError={!!errors.firstName}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-danger text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-semibold mb-1">
              Отчество
            </label>
            <Input id="middleName" {...register('middleName')} placeholder="Сергеевич" />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
              Телефон <span className="text-danger">*</span>
            </label>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="+375 29 123-45-67"
              isError={!!errors.phone}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="example@mail.com"
              isError={!!errors.email}
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-semibold mb-1">
              Комментарий
            </label>
            <textarea
              id="comment"
              {...register('comment')}
              placeholder="Дополнительная информация (необязательно)"
              className="w-full rounded-control border border-line px-3 py-2.5 text-[15px] outline-none focus:border-navy focus:ring-4 focus:ring-navy/12 min-h-24"
            />
            {errors.comment && <p className="text-danger text-xs mt-1">{errors.comment.message}</p>}
          </div>

          <div>
            <label className="flex gap-2 items-start text-sm">
              <input type="checkbox" {...register('consent')} className="mt-0.5" />
              <span>
                Согласен на обработку персональных данных для оказания услуги.{' '}
                <span className="text-danger">*</span>
              </span>
            </label>
            {errors.consent && (
              <p className="text-danger text-xs mt-1">{errors.consent.message}</p>
            )}
          </div>

          <div className="pt-4 border-t border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-ok font-semibold min-h-5">
              {draftSavedAt && `✓ Черновик сохранён ${draftSavedAt}`}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" type="button" onClick={onSaveAndExit}>
                Сохранить и выйти
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                Подписать и отправить
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}