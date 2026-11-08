import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

type Message = { role: 'user' | 'ai'; text: string }

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Здравствуйте! Я — цифровой помощник. Чем я могу вам помочь?' },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    'Как получить справку о доходах?',
    'Как войти через ID-карту?',
    'Где посмотреть статус заявления?',
  ]

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    // Имитация ответа
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Я нашел информацию по вашему вопросу. Вы можете оформить эту услугу в разделе «Каталог услуг». Если нужна помощь с ID-картой, перейдите по ссылке в разделе «О портале».',
        },
      ])
    }, 1000)
  }

  return (
    <>
      {/* Кнопка вызова чата */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-28 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-navy text-white rounded-full shadow-lg flex items-center justify-center hover:bg-navy-deep transition-transform hover:scale-105 z-40',
          isOpen && 'hidden',
        )}
        aria-label="Открыть ИИ-помощника"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Окно чата */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="ИИ-Помощник"
          className="fixed bottom-6 right-6 w-[calc(100vw-3rem)] md:w-96 bg-white rounded-card shadow-2xl border border-line flex flex-col z-50 overflow-hidden"
          style={{ height: '550px', maxHeight: 'calc(100vh - 6rem)' }}
        >
          {/* Шапка */}
          <div className="bg-navy text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm">ИИ-Помощник</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Закрыть чат"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* История сообщений */}
          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-bg/50">
            {messages.map((msg, i) => (
              <div key={i} className={clsx('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl px-4 py-2 text-sm',
                    msg.role === 'user'
                      ? 'bg-navy text-white rounded-br-none'
                      : 'bg-white border border-line text-ink rounded-bl-none shadow-sm',
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-line rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex gap-1 items-center h-9">
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>

          {/* Чипсы с быстрыми вопросами (только в начале) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0 bg-bg/50">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-soft text-navy px-3 py-1.5 rounded-full hover:bg-navy hover:text-white transition-colors border border-navy/20 text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="p-3 border-t border-line bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 bg-bg rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-navy/20"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="text-navy p-2 hover:bg-soft rounded-full disabled:opacity-50"
              aria-label="Отправить"
            >
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