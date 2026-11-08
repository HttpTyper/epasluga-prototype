import { Input, Button } from '../../design-system'

type CatalogToolbarProps = {
  query: string
  onQueryChange: (v: string) => void
  onSubmit: () => void
  onReset: () => void
  showReset: boolean
}

export function CatalogToolbar({ query, onQueryChange, onSubmit, onReset, showReset }: CatalogToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mb-4">
      <div className="flex-1">
        <label htmlFor="catalog-q" className="block text-xs text-muted mb-1">
          Что нужно сделать
        </label>
        <Input
          id="catalog-q"
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
          placeholder="доходы, паспорт, авто…"
          className="h-11"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={onSubmit} className="h-11">Найти</Button>
        {showReset && (
          <Button variant="ghost" onClick={onReset} className="h-11">
            Сбросить
          </Button>
        )}
      </div>
    </div>
  )
}