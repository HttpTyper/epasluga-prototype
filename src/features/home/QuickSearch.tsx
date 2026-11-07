import { useState } from 'react'
import { Input } from '../../design-system'
import { mockServices } from '../../lib/api/mocks/fixtures/services'

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Простой поиск по названию и категории
  const results = query.trim().length > 0 
    ? mockServices.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.officialTitle.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="relative max-w-2xl w-full">
      <div className="relative">
        <Input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Введите запрос: справка о доходах, регистрация авто..."
          className="h-14 pl-5 pr-12 text-base shadow-sm"
        />
        <svg className="absolute right-4 top-4 w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Выпадающий список подсказок */}
      {isFocused && query.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-line rounded-control shadow-card z-30 max-h-80 overflow-auto">
          {results.length > 0 ? (
            results.map(s => (
              <button key={s.id} className="w-full text-left px-4 py-3 hover:bg-soft border-b border-line/50 last:border-0 block transition-colors">
                <span className="block font-semibold text-navy-deep">{s.title}</span>
                <span className="text-xs text-muted mt-0.5 block">{s.officialTitle}</span>
              </button>
            ))
          ) : (
            <div className="p-4 text-muted text-sm">Ничего не найдено. Попробуйте изменить запрос.</div>
          )}
        </div>
      )}
      
      {/* Подсказка-заглушка (п. #10) */}
      {!isFocused && query.length === 0 && (
        <div className="mt-2 text-sm text-muted flex gap-2 flex-wrap">
          <span>Попробуйте:</span>
          {['справка о доходах', 'регистрация авто', 'выписка из ЕГР'].map(hint => (
            <button key={hint} onClick={() => setQuery(hint)} className="text-navy hover:underline">
              "{hint}"
            </button>
          ))}
        </div>
      )}
    </div>
  )
}