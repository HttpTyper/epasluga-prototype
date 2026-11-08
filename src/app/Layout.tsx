import { NavLink, Outlet, Link } from 'react-router-dom'
import { AiAssistant } from '../features/support/AiAssistant'
import { Breadcrumbs } from './Breadcrumbs'
import { useNotifications } from '../lib/notifications'
import clsx from 'clsx'

const navItems = [
  { to: '/', label: 'Главная', end: true, icon: 'home' },
  { to: '/catalog', label: 'Каталог', icon: 'grid' },
  { to: '/apps', label: 'Мои услуги', icon: 'file' },
  { to: '/profile', label: 'Профиль', icon: 'user' },
]

// Иконки для мобильного меню
const MobileIcon = ({ name }: { name: string }) => {
  const cls = "w-6 h-6 mb-1"
  if (name === 'home') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m4 11 8-7 8 7v9H4v-9Z" /></svg>
  if (name === 'grid') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="4" y="5" width="6" height="6" rx="1"/><rect x="14" y="5" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/></svg>
  if (name === 'file') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 4h7l5 5v11H7V4ZM14 4v5h5" /></svg>
  if (name === 'user') return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="8" r="3.2"/><path strokeLinecap="round" strokeLinejoin="round" d="M5 19c1.5-3 4-4.5 7-4.5S17.5 16 19 19"/></svg>
  return null
}

export function Layout() {
  const { items } = useNotifications()
  const unreadCount = items.filter((n) => !n.archived).length

  return (
    <div className="min-h-screen flex bg-bg relative">
      
      {/* --- САЙДБАР (только для десктопа) --- */}
      <aside className="hidden md:flex flex-col w-64 bg-navy text-white shrink-0">
        <div className="p-5 font-bold text-xl">Е-Паслуга</div>
        <nav className="flex flex-col">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
            }
          >
            Уведомления
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
            }
          >
            Поддержка
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `px-5 py-3 text-sm hover:bg-white/10 ${isActive ? 'bg-white/15 font-semibold' : ''}`
            }
          >
            О портале
          </NavLink>
        </nav>
      </aside>

      {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-4 md:px-7 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Логотип для мобилки (т.к. сайдбар скрыт) */}
            <span className="md:hidden font-bold text-navy text-lg">Е-Паслуга</span>
            <span className="text-muted text-sm hidden md:block">Личный кабинет гражданина</span>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Уведомления в шапке (на всех экранах, но особенно важно на мобилках) */}
            <Link to="/notifications" className="relative p-2 text-muted hover:text-navy transition-colors rounded-lg hover:bg-soft">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16ZM10 16a2 2 0 0 0 4 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
              )}
            </Link>

            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-ink font-semibold text-sm hidden sm:block">Иван</span>
              <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                ИА
              </div>
            </Link>
          </div>
        </header>
        
        <main className="flex-1 p-4 md:p-7">
          <Breadcrumbs />
          <Outlet />
        </main>
      </div>

      {/* --- НИЖНЯЯ НАВИГАЦИЯ (только для мобилок) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-line flex justify-around items-center h-16 z-40 pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              clsx(
                "flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors",
                isActive ? "text-navy" : "text-muted hover:text-navy"
              )
            }
          >
            <MobileIcon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <AiAssistant />
    </div>
  )
}