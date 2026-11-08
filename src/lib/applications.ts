import { useCallback, useEffect, useState } from 'react'
import type { Application } from '../types/service'

const APPS_KEY = 'epasluga-apps'

const SEED: Application[] = [
  { id: 'a1', num: '453346557107272', title: 'Справка о доходах', serviceId: '3-05-03', initiator: 'Министерство по налогам и сборам', status: 'Выполнено', at: new Date().toISOString(), comment: '' },
  { id: 'a2', num: '289953663290680', title: 'Справка о доходах', serviceId: '3-05-03', initiator: 'Министерство по налогам и сборам', status: 'Ожидает оплаты', at: new Date().toISOString(), comment: '' },
  { id: 'a3', num: '100294837561002', title: 'Паспорт гражданина РБ', serviceId: '200-12-1', initiator: 'Министерство внутренних дел', status: 'На проверке', at: new Date(Date.now() - 86400000).toISOString(), comment: '' },
  { id: 'a4', num: '100294837561088', title: 'Регистрация автомобиля', serviceId: '200-15-11', initiator: 'Министерство внутренних дел', status: 'Черновик', at: new Date(Date.now() - 2 * 86400000).toISOString(), comment: '' },
  { id: 'a5', num: '100294837561201', title: 'Справка призывнику', serviceId: '200-20-5', initiator: 'Министерство обороны', status: 'Отозвано', at: new Date(Date.now() - 4 * 86400000).toISOString(), comment: '' },
  { id: 'a6', num: '100294837561333', title: 'Лицензия адвоката', serviceId: '200-17-1-1', initiator: 'Министерство юстиции', status: 'Отказано', at: new Date(Date.now() - 8 * 86400000).toISOString(), comment: 'Неполный комплект документов' },
]

function read(): Application[] {
  try {
    const raw = JSON.parse(localStorage.getItem(APPS_KEY) || 'null')
    if (Array.isArray(raw)) return raw
  } catch { /* ignore */ }
  localStorage.setItem(APPS_KEY, JSON.stringify(SEED))
  return SEED
}

function write(rows: Application[]) {
  localStorage.setItem(APPS_KEY, JSON.stringify(rows))
}

export function useApplications() {
  const [apps, setApps] = useState<Application[]>(() => read())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === APPS_KEY) setApps(read()) }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = useCallback((id: string, patch: Partial<Application>) => {
    setApps((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
      write(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setApps((prev) => {
      const next = prev.filter((a) => a.id !== id)
      write(next)
      return next
    })
  }, [])

  return { apps, update, remove }
}