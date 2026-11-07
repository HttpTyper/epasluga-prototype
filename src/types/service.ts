export interface Service {
  id: string
  title: string            // Человеческое название (напр. "Справка о доходах")
  officialTitle: string    // Официальное название с кодом
  description: string      // Краткое описание
  category: string         // Категория (напр. "Налоги", "Недвижимость")
  situation?: string       // Жизненная ситуация (напр. "Покупка авто")
  authLevel: 'none' | 'id' | 'ecp' // Что нужно для входа
  timeToComplete: string   // Срок оказания (напр. "3 дня")
  cost: string             // Стоимость (напр. "Бесплатно")
  format: string           // Формат результата (напр. "PDF-файл")
  orgName: string          // Название ведомства
  orgUnp: string           // УНП ведомства
}