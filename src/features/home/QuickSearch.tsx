import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../../design-system'
import { useSuggestions } from '../../hooks/useSearch'

const HINTS = ['справка о доходах', 'регистрация авто', 'паспорт', 'пенсия', 'штрафы ГАИ']

export function QuickSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const suggestions = useSuggestions(query)
  const showDropdown = isFocused && query.trim().length > 0

  const goToService = (id: string) => {
    setIsFocused(false)
    navigate(`/service/${id}`)
  }

  const goToCatalog = () => {
    if (!query.trim()) return
    setIsFocused(false)
    navigate(`/catalog?q=${encodeURIComponent(query.trim())}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        e.preventDefault()
        goToCatalog()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goToService(suggestions[activeIndex].id)
      } else {
        goToCatalog()
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div className="relative max-w-2xl w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 180)}
          onKeyDown={onKeyDown}
          placeholder='Например: «справка о доходах», «регистрация авто»'
          className="h-14 pl-5 pr-12 text-base shadow-sm"
          aria-label="Поиск услуг"
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="quick-search-listbox"
        />
        <svg
          className="absolute right-4 top-4 w-6 h-6 text-navy"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Подсказки-чипсы, когда поле пустое (эвристика #10) */}
      {!isFocused && query.length === 0 && (
        <div className="mt-3 text-sm text-muted flex gap-2 flex-wrap items-center">
          <span>Попробуйте:</span>
          {HINTS.map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => {
                setQuery(hint)
                inputRef.current?.focus()
              }}
              className="text-navy hover:underline"
            >
              «{hint}»
            </button>
          ))}
        </div>
      )}

      {/* Выпадающий список подсказок */}
      {showDropdown && (
        <div
          id="quick-search-listbox"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-line rounded-control shadow-card z-30 max-h-96 overflow-auto"
        >
          {suggestions.length > 0 ? (
            <>
              {suggestions.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => goToService(s.id)}
                  className={`w-full text-left px-4 py-3 border-b border-line/50 last:border-0 block transition-colors ${
                    i === activeIndex ? 'bg-soft' : 'hover:bg-soft'
                  }`}
                >
                  <span className="block font-semibold text-navy-deep">{s.shortTitle}</span>
                  <span className="text-xs text-muted mt-0.5 block">{s.categoryTitle}</span>
                </button>
              ))}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={goToCatalog}
                className="w-full text-left px-4 py-3 text-sm text-navy font-semibold hover:bg-soft border-t border-line"
              >
                Показать все результаты для «{query}» →
              </button>
            </>
          ) : (
            <div className="p-4 text-muted text-sm">
              Ничего не нашли. Попробуйте «доходы», «паспорт», «авто» или{' '}
              <a href="/catalog" className="text-navy underline">
                откройте каталог
              </a>
              .
            </div>
          )}
        </div>
      )}
    </div>
  )
}