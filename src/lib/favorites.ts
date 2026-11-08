import { useCallback, useEffect, useState } from 'react'

const FAV_KEY = 'epasluga-favs'

function readFavs(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(FAV_KEY) || '[]')
    if (Array.isArray(raw)) return new Set(raw)
  } catch {
    // ignore corrupt storage
  }
  return new Set()
}

function writeFavs(set: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]))
}

/** Хук избранного с синхронизацией между вкладками. */
export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => readFavs())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === FAV_KEY) setFavs(readFavs())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback((id: string) => {
    setFavs((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      writeFavs(next)
      return next
    })
  }, [])

  const has = useCallback((id: string) => favs.has(id), [favs])

  return { favs, toggle, has }
}