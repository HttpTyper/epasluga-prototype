import { QuickSearch } from './QuickSearch'
import { QuickActions } from './QuickActions'
import { LifeSituations } from './LifeSituations'

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Приветствие и Поиск */}
      <section className="pt-4">
        <h1 className="text-3xl font-bold text-navy-deep mb-2">Добрый день!</h1>
        <p className="text-muted mb-6">Что вы хотите сделать сегодня?</p>
        <QuickSearch />
      </section>

      {/* Быстрые действия */}
      <section>
        <QuickActions />
      </section>

      {/* Жизненные ситуации */}
      <section>
        <LifeSituations />
      </section>
    </div>
  )
}