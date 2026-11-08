import { useMemo, useState } from 'react'
import { searchServices, suggestServices } from '../lib/search'
import type { Service } from '../types/service'

/** Подсказки для autocomplete с дебаунсом, чтобы не дёргать поиск на каждый символ. */
export function useSuggestions(query: string, delay = 120) {
  const [debounced, setDebounced] = useState(query)

  useMemo(() => {
    const t = setTimeout(() => setDebounced(query), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, delay])

  return useMemo<Service[]>(() => {
    if (!debounced.trim()) return []
    return suggestServices(debounced, 6)
  }, [debounced])
}

/** Полный поиск (для страницы каталога). */
export function useSearchResults(query: string): Service[] {
  return useMemo(() => searchServices(query).map((h) => h.service), [query])
}