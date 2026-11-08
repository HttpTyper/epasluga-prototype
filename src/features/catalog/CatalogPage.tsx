import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../../data/categories'
import { situations } from '../../data/situations'
import { searchServices } from '../../lib/search'
import { useFavorites } from '../../lib/favorites'
import { CatalogCard } from './CatalogCard'
import { CategoryGrid } from './CategoryGrid'
import { CatalogToolbar } from './CatalogToolbar'
import { EmptyState } from '../../design-system'
import clsx from 'clsx'

type Mode = 'cats' | 'list' | 'favs'

function parseMode(raw: string | null): Mode {
  if (raw === 'list' || raw === 'favs') return raw
  return 'cats'
}

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const mode = parseMode(params.get('view'))
  const categoryId = params.get('cat') ?? ''
  const situationId = params.get('sit') ?? ''
  const query = params.get('q') ?? ''

  const [draftQuery, setDraftQuery] = useState(query)
  const { favs, toggle, has } = useFavorites()

  const activeCategory = categories.find((c) => c.id === categoryId)

  const filtered = useMemo(() => {
    let list = searchServices(query).map((h) => h.service)
    if (categoryId) list = list.filter((s) => s.category === categoryId)
    if (situationId) list = list.filter((s) => s.situations.includes(situationId))
    return list
  }, [query, categoryId, situationId])

  const favList = useMemo(
    () => filtered.filter((s) => favs.has(s.id)),
    [filtered, favs],
  )

  const patchParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    })
    setParams(next)
  }

  const setMode = (m: Mode) => patchParams({ view: m, cat: null, sit: null, q: null })
  const setSituation = (id: string) => patchParams({ sit: id || null })
  const submitQuery = () => patchParams({ q: draftQuery.trim() || null })
  const resetFilters = () => {
    setDraftQuery('')
    setParams(new URLSearchParams())
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">
          {mode === 'favs'
            ? 'Избранные услуги'
            : activeCategory
              ? activeCategory.title
              : mode === 'list'
                ? 'Все услуги'
                : 'Услуги по категориям'}
        </h1>
        <p className="text-muted max-w-2xl">
          {mode === 'favs'
            ? 'Услуги, отмеченные звёздочкой. В общем списке они тоже стоят первыми.'
            : activeCategory
              ? activeCategory.desc
              : 'Выберите тему — или найдите услугу своими словами. Код знать не обязательно.'}
        </p>
      </header>

      {/* Переключатель режимов */}
      <div className="inline-flex gap-1 mb-5 bg-soft p-1 rounded-full">
        {(
          [
            ['cats', 'По категориям'],
            ['list', 'Все услуги'],
            ['favs', 'Избранное'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={clsx(
              'px-5 py-2 rounded-full text-sm font-semibold transition-colors',
              mode === value ? 'bg-white text-navy shadow-sm' : 'text-muted hover:text-navy',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Режим «категории» */}
      {mode === 'cats' && !activeCategory && (
        <CategoryGrid categories={categories} />
      )}

      {/* Режим «список» и «избранное» — тулбар + чипсы ситуаций */}
      {(mode === 'list' || mode === 'favs') && (
        <>
          <CatalogToolbar
            query={draftQuery}
            onQueryChange={setDraftQuery}
            onSubmit={submitQuery}
            onReset={resetFilters}
            showReset={!!(query || categoryId || situationId)}
          />

          {!categoryId && mode === 'list' && (
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                type="button"
                onClick={() => setSituation('')}
                className={clsx(
                  'px-3.5 py-1.5 rounded-full text-sm border transition-colors',
                  !situationId
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-line hover:border-navy',
                )}
              >
                Все ситуации
              </button>
              {situations.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSituation(s.id)}
                  title={s.hint}
                  className={clsx(
                    'px-3.5 py-1.5 rounded-full text-sm border transition-colors',
                    situationId === s.id
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-navy border-line hover:border-navy',
                  )}
                >
                  {s.title}
                </button>
              ))}
            </div>
          )}

          {mode === 'list' && (
            <div className="text-sm text-muted mb-3">
              {filtered.length > 0 ? (
                <>Найдено: <b className="text-ink">{filtered.length}</b></>
              ) : (
                'Ничего не найдено'
              )}
            </div>
          )}

          {(mode === 'list' ? filtered : favList).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(mode === 'list' ? filtered : favList).map((s) => (
                <CatalogCard
                  key={s.id}
                  service={s}
                  isFavorite={has(s.id)}
                  onToggleFavorite={() => toggle(s.id)}
                />
              ))}
            </div>
          ) : mode === 'favs' ? (
            <EmptyState
              title="Пока пусто"
              description="Откройте каталог и нажмите звёздочку на карточке — услуга появится здесь."
              action={
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold bg-navy text-white hover:bg-navy-deep"
                >
                  Открыть все услуги
                </button>
              }
            />
          ) : (
            <EmptyState
              title="Ничего не найдено"
              description="Попробуйте изменить запрос или сбросить фильтры."
              action={
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center justify-center rounded-control px-4 py-2.5 text-[15px] font-semibold border border-navy text-navy hover:bg-soft"
                >
                  Сбросить
                </button>
              }
            />
          )}
        </>
      )}
    </div>
  )
}