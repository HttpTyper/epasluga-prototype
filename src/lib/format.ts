import type { ApplicationStatus } from '../types/service'

export function formatWhen(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const start = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime()
  const diff = Math.round((start(now) - start(d)) / 86400000)
  if (diff === 0) return 'Сегодня'
  if (diff === 1) return 'Вчера'
  return d.toLocaleDateString('ru-BY', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function statusClass(st: ApplicationStatus): string {
  if (st === 'Выполнено') return 'bg-[#e6f6ec] text-ok'
  if (st === 'Ожидает оплаты') return 'bg-[#fff4e5] text-accent-warm'
  if (st === 'Черновик') return 'bg-soft text-muted'
  if (st === 'На проверке') return 'bg-[#e8eeff] text-navy'
  if (st === 'Отозвано') return 'bg-[#f4f4f5] text-[#52525b]'
  if (st === 'Отказано') return 'bg-[#fdecea] text-danger'
  return 'bg-soft text-muted'
}

export function statusHelp(st: ApplicationStatus): string {
  if (st === 'Отозвано') return 'Вы отменили заявление. Документ по нему не выдадут.'
  if (st === 'Отказано') return 'Ведомство не оказало услугу. Причину смотрите в комментарии.'
  if (st === 'Ожидает оплаты') return 'Заявление принято, но без оплаты документ не выдадут.'
  if (st === 'Черновик') return 'Вы ещё не отправили заявление.'
  return ''
}