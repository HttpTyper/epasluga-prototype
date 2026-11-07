import { NavLink, Outlet, Link } from 'react-router-dom'
import { AiAssistant } from '../features/support/AiAssistant'

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог услуг' },
  { to: '/status', label: 'Мои заявления' },
  { to: '/profile', label: 'Личный кабинет' },
  { to: '/support', label: 'Поддержка' },
  { to: '/about', label: 'О портале' },
]

export function Layout() {
  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 bg-navy text-white shrink-0">
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
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-line flex items-center justify-between px-7 sticky top-0 z-20">
          <span className="text-muted text-sm"></span>
          
          {/* Блок профиля в шапке */}
          <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-ink font-semibold text-sm">Иван</span>
            <div className="w-8 h-8 bg-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
              ИИ
            </div>
          </Link>
        </header>
        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>
      
      {/* Подключаем ИИ-помощника глобально */}
      <AiAssistant />
    </div>
  )
}