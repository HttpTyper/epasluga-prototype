import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card } from '../../design-system'
import type { Service } from '../../types/service'

export function SuccessScreen({ service }: { service: Service }) {
  const [rating, setRating] = useState<number | null>(null)
  const [isRated, setIsRated] = useState(false)

  return (
    <div className="max-w-xl mx-auto py-12 text-center">
      {/* Иконка успеха */}
      <div className="w-20 h-20 bg-[#e6f6ec] text-ok rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-navy-deep mb-4">Заявление принято!</h1>
      <p className="text-lg text-ink mb-2">Услуга: {service.title}</p>
      
      {/* Человеческий язык вместо канцелярита (п. #2) */}
      <p className="text-muted mb-8">
        Срок оказания: <strong className="text-ink">{service.timeToComplete}</strong>.<br />
        Мы пришлем уведомление на ваш email, когда документ будет готов.
      </p>

      <div className="flex flex-col gap-3 items-center mb-12">
        <Link to="/status">
          <Button className="w-64">Перейти к моим заявлениям</Button>
        </Link>
        <Link to="/" className="text-sm text-navy hover:underline mt-2">
          Вернуться на главную
        </Link>
      </div>

      {/* Оценка услуги (п. #1 аудита) */}
      <Card className="bg-soft border-line text-left">
        <h3 className="font-bold text-navy-deep mb-2 text-center">Насколько легко было получить услугу?</h3>
        {isRated ? (
          <p className="text-center text-ok font-semibold">Спасибо за ваш отзыв! Это помогает нам становиться лучше.</p>
        ) : (
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => { setRating(star); setIsRated(true) }}
                className={`w-10 h-10 rounded-full font-bold transition-colors ${
                  rating && rating >= star ? 'bg-navy text-white' : 'bg-white text-navy border border-navy hover:bg-soft'
                }`}
              >
                {star}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}