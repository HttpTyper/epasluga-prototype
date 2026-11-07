import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Input } from '../../design-system'

export function LoginPage() {
  // Режимы: 'default' (выбор), 'id-error' (диагностика), 'alt' (по номеру)
  const [mode, setMode] = useState<'default' | 'id-error' | 'alt'>('default')
  const [pinCode, setPinCode] = useState('')

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Вход в личный кабинет</h1>
        <p className="text-muted">Выберите удобный способ авторизации</p>
      </div>

      {mode === 'default' && (
        <Card className="space-y-4">
          <Button className="w-full h-14" onClick={() => setMode('id-error')}>
            Войти через ID-карту
          </Button>
          <Button variant="ghost" className="w-full h-14" onClick={() => setMode('alt')}>
            Войти по номеру телефона
          </Button>
          <div className="pt-4 text-center text-sm text-muted">
            Впервые здесь? <a href="#" className="text-navy hover:underline">Активировать кабинет</a>
          </div>
        </Card>
      )}

      {/* Экран диагностики ID-карты (п. #5 и #9 аудита) */}
      {mode === 'id-error' && (
        <Card className="border-danger/30 bg-[#fffbfa]">
          <div className="flex items-center gap-3 mb-4 text-danger">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-lg font-bold text-navy-deep">Не удалось прочитать карту</h2>
          </div>
          <p className="text-sm text-muted mb-4">Пожалуйста, проверьте следующее:</p>
          <ul className="text-sm space-y-3 mb-6">
            <li className="flex gap-2">
              <span className="text-navy font-bold">1.</span>
              <span>Приложите ID-карту к верхней части телефона (или вставьте в картридер).</span>
            </li>
            <li className="flex gap-2">
              <span className="text-navy font-bold">2.</span>
              <span>Убедитесь, что модуль NFC включен в настройках.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-navy font-bold">3.</span>
              <span>Введите <strong>PIN 1</strong> (не PIN 2 и не PUK).</span>
            </li>
          </ul>
          <Button className="w-full" onClick={() => setMode('default')}>Попробовать снова</Button>
          <Button variant="ghost" className="w-full mt-3" onClick={() => setMode('alt')}>
            Войти другим способом
          </Button>
        </Card>
      )}

      {/* Альтернативный вход (п. #1 аудита - таймаут) */}
      {mode === 'alt' && (
        <Card>
          <h2 className="text-lg font-bold text-navy-deep mb-2">Вход по номеру телефона</h2>
          <p className="text-sm text-muted mb-4">Мы отправим код подтверждения по SMS.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Номер телефона</label>
              <Input placeholder="+375 29 123-45-67" />
            </div>
            <Button className="w-full">Получить код</Button>
            <button onClick={() => setMode('default')} className="w-full text-center text-sm text-navy hover:underline pt-2">
              ← Назад к выбору способа
            </button>
          </div>
        </Card>
      )}

      {/* Поддержка без авторизации (п. #9 аудита) */}
      <div className="mt-8 text-center text-sm">
        <span className="text-muted">Не получается войти? </span>
        <Link to="/support" className="text-navy font-semibold hover:underline">
          Обратитесь в поддержку
        </Link>
      </div>
    </div>
  )
}