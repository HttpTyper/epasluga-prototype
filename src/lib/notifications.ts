import { useCallback, useEffect, useState } from 'react'
import type { AppNotification } from '../types/service'

const NOTIF_KEY = 'epasluga-notifs'

const SEED: AppNotification[] = [
  { id: 'n1', kind: 'legal', title: 'Справка о доходах — Готово', body: 'Документ можно скачать в разделе «Мои услуги».', at: new Date().toISOString(), archived: false },
  { id: 'n2', kind: 'legal', title: 'Справка о доходах — Ожидает оплаты', body: 'Заявление 289953663290680 не будет выдано, пока не поступит оплата.', at: new Date().toISOString(), archived: false },
  { id: 'n3', kind: 'legal', title: 'Справка призывнику — Отозвано', body: 'Вы отменили заявление. Документ не действует.', at: new Date(Date.now() - 4 * 86400000).toISOString(), archived: false },
  { id: 'n4', kind: 'legal', title: 'Лицензия адвоката — Отказано', body: 'Ведомство не смогло оказать услугу. Причина указана в «Моих услугах».', at: new Date(Date.now() - 8 * 86400000).toISOString(), archived: false },
  { id: 'n5', kind: 'info', title: 'Плановые работы 1 ноября', body: 'Ночью кабинет может быть недоступен около двух часов.', at: new Date(Date.now() - 86400000).toISOString(), archived: false },
  { id: 'n6', kind: 'info', title: 'Черновик заявления не отправлен', body: 'Регистрация авто сохранена как черновик.', at: new Date(Date.now() - 2 * 86400000).toISOString(), archived: false },
]

function read(): AppNotification[] {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTIF_KEY) || 'null')
    if (Array.isArray(raw)) return raw
  } catch { /* ignore */ }
  localStorage.setItem(NOTIF_KEY, JSON.stringify(SEED))
  return SEED
}

function write(rows: AppNotification[]) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(rows))
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>(() => read())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === NOTIF_KEY) setItems(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const archive = useCallback((id: string) => {
    setItems((prev) => { const next = prev.map((n) => n.id === id ? { ...n, archived: true } : n); write(next); return next })
  }, [])

  const unarchive = useCallback((id: string) => {
    setItems((prev) => { const next = prev.map((n) => n.id === id ? { ...n, archived: false } : n); write(next); return next })
  }, [])

  const remove = useCallback((id: string) => {
    setItems((prev) => { const next = prev.filter((n) => n.id !== id || n.kind === 'legal'); write(next); return next })
  }, [])

  return { items, archive, unarchive, remove }
}