import { services } from '../data/services'
import { synonyms } from '../data/synonyms'
import type { Service } from '../types/service'

/** Нормализация: нижний регистр, ё→е, схлопывание пробелов. */
export function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Собираем поисковый «блоб» для каждой услуги один раз. */
const index: Array<{ service: Service; blob: string; shortBlob: string }> = services.map((s) => ({
  service: s,
  blob: normalize(
    [s.shortTitle, s.officialTitle, s.code, s.orgName, s.categoryTitle].join(' '),
  ),
  shortBlob: normalize(s.shortTitle),
}))

/** Совпадения по синонимам: возвращает Set кодов услуг, которые надо подмешать. */
function synonymHits(query: string): Set<string> {
  const q = normalize(query)
  const hits = new Set<string>()
  if (!q) return hits

  for (const [key, ids] of Object.entries(synonyms)) {
    const k = normalize(key)
    // совпадение в обе стороны: «доход» ⊂ «доходы» и наоборот
    if (k.includes(q) || q.includes(k)) {
      ids.forEach((id) => hits.add(id))
    }
  }
  return hits
}

export type SearchHit = {
  service: Service
  /** 0 — прямое совпадение по короткому названию, 1 — синоним, 2 — по описанию, 3 — по коду */
  rank: number
}

export function searchServices(query: string): SearchHit[] {
  const q = normalize(query)
  if (!q) return services.map((service) => ({ service, rank: 2 }))

  const synHits = synonymHits(q)
  const result: SearchHit[] = []

  for (const { service, blob, shortBlob } of index) {
    if (shortBlob.includes(q)) {
      result.push({ service, rank: 0 })
    } else if (synHits.has(service.code) || synHits.has(service.id)) {
      result.push({ service, rank: 1 })
    } else if (blob.includes(q)) {
      result.push({ service, rank: 2 })
    } else if (normalize(service.code).includes(q)) {
      result.push({ service, rank: 3 })
    }
  }

  result.sort((a, b) => a.rank - b.rank || a.service.shortTitle.localeCompare(b.service.shortTitle))
  return result
}

/** Топ-N подсказок для выпадающего списка. */
export function suggestServices(query: string, limit = 6): Service[] {
  return searchServices(query).slice(0, limit).map((h) => h.service)
}