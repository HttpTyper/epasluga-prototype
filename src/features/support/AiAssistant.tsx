import { useState } from 'react'
import { Button } from '../../design-system'
import clsx from 'clsx'

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Здравствуйте! Я — цифровой помощник. Чем я могу вам помочь?' }
  ])
  const [input, setInput] = useState('')

  const quickQuestions = [
    'Как получить справку о доходах?',
    'Как войти через ID-карту?',
    'Сколько стоит проверка недвижимости?'
  ]

  const handleSend = (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    
    // Имитация ответа ИИ
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: 'Я нашел информацию по вашему вопросу. Вы можете оформить эту услугу в разделе «Каталог услуг». Если нужна помощь с ID-картой, перейдите по ссылке в разделе «О портале».' 
      }])
    }, 1000)
  }

  return (
    <>
      {/* Кнопка вызова чата */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-6 right-6 w-14 h-14 bg-navy text-white rounded-full shadow-lg flex items-center justify-center hover:bg-navy-deep transition-transform hover:scale-105 z-40',
          isOpen && 'hidden'
        )}
        aria-label="Открыть ИИ-помощника"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-card shadow-2xl border border-line flex flex-col z-50 overflow-hidden" style={{ height: '500px' }}>
          {/* Шапка чата */}
          <div className="bg-navy text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm">ИИ-Помощник</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* История сообщений */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg/50">
            {messages.map((msg, i) => (
              <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div className={clsx(
                  'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                  msg.role === 'user' ? 'bg-navy text-white rounded-br-none' : 'bg-white border border-line text-ink rounded-bl-none shadow-sm'
                )}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Чипсы с быстрыми вопросами (п. #5 аудита) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-soft text-navy px-3 py-1.5 rounded-full hover:bg-navy hover:text-white transition-colors border border-navy/20"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="p-3 border-t border-line bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 bg-bg rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-navy/20"
            />
            <button onClick={() => handleSend(input)} className="text-navy p-2 hover:bg-soft rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}