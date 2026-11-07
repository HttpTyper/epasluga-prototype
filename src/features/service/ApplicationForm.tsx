import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input, Button, Card } from '../../design-system'
import type { Service } from '../../types/service'
import { SuccessScreen } from './SuccessScreen'

export function ApplicationForm({ service }: { service: Service }) {
  // Состояния полей
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Состояния ошибок
  const [errors, setErrors] = useState({ fullName: '', phone: '', email: '' })
  
  // Состояние автосохранения (п. #3)
  const [isDraftSaved, setIsDraftSaved] = useState(false)

  // Валидация в реальном времени (п. #9)
  const validatePhone = (val: string) => {
    if (!val) return 'Введите номер телефона'
    // Простая проверка на формат +375 XX XXX-XX-XX
    if (!/^\+375\s?\d{2}\s?\d{3}-\d{2}-\d{2}$/.test(val)) {
      return 'Введите номер в формате +375 XX XXX-XX-XX'
    }
    return ''
  }

  // Автосохранение черновика при изменении любого поля
  useEffect(() => {
    if (fullName || phone || email) {
      setIsDraftSaved(true)
      const timer = setTimeout(() => setIsDraftSaved(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [fullName, phone, email])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const phoneError = validatePhone(phone)
    const emailError = email.includes('@') ? '' : 'Введите корректный email'
    
    setErrors({ fullName: '', phone: phoneError, email: emailError })

    if (!phoneError && !emailError && fullName) {
      setIsSubmitted(true)
      // В реальности здесь был бы редирект на страницу статуса
    }
  }
  if (isSubmitted) {
    return <SuccessScreen service={service} />
    }
  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-sm text-muted mb-6">
        <Link to={`/service/${service.id}`} className="hover:text-navy">← Вернуться к описанию</Link>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-deep mb-2">Заполнение заявления</h1>
        <p className="text-muted">{service.title}</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Поле 1: ФИО */}
          <div>
            <label className="block text-sm font-semibold mb-1">ФИО <span className="text-danger">*</span></label>
            <Input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              placeholder="Иванов Иван Иванович"
              isError={!!errors.fullName}
            />
            {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Поле 2: Телефон */}
          <div>
            <label className="block text-sm font-semibold mb-1">Номер телефона <span className="text-danger">*</span></label>
            <Input 
              value={phone} 
              onChange={e => {
                setPhone(e.target.value)
                setErrors({ ...errors, phone: validatePhone(e.target.value) })
              }} 
              onBlur={() => setErrors({ ...errors, phone: validatePhone(phone) })}
              placeholder="+375 29 123-45-67"
              isError={!!errors.phone}
            />
            {errors.phone && <p className="text-danger text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Поле 3: Email */}
          <div>
            <label className="block text-sm font-semibold mb-1">Email <span className="text-danger">*</span></label>
            <Input 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="example@mail.com"
              isError={!!errors.email}
            />
            {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Блок кнопок */}
          <div className="pt-4 border-t border-line flex items-center justify-between">
            <div className="text-sm text-ok font-semibold h-5">
              {isDraftSaved && '✓ Черновик сохранен'}
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" type="button">Сохранить и выйти</Button>
              <Button type="submit">Подписать и отправить</Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  )
}