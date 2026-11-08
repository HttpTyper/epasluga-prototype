export type AuthLevel = 'none' | 'id' | 'ecp'

export interface Service {
  id: string
  code: string              // «3.05.03» — вторично, мелким шрифтом
  shortTitle: string        // «Справка о доходах» — главное
  officialTitle: string     // «Сведения о доходах физического лица...»
  plainDescription: string  // 1–2 предложения по-человечески
  official: string          // полное юридическое — в аккордеон
  category: string          // id категории (ip/law/edu/...)
  categoryTitle: string     // «Налоги и торговля» — для отображения
  situations: string[]      // ['tax', 'work', 'housing']
  authLevel: AuthLevel
  timeToComplete: string
  cost: string
  format: string
  orgName: string
  orgUnp: string
  steps: string[]
}

export interface Situation {
  id: string
  title: string
  hint: string
}

export interface Category {
  id: string
  title: string
  desc: string
  icon: string
}

export type ApplicationStatus =
  | 'Черновик'
  | 'На проверке'
  | 'Ожидает оплаты'
  | 'Выполнено'
  | 'Отозвано'
  | 'Отказано'

export interface Application {
  id: string
  num: string
  title: string
  serviceId: string
  initiator: string
  status: ApplicationStatus
  at: string
  comment: string
}

export type NotificationKind = 'legal' | 'info'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  at: string
  archived: boolean
}