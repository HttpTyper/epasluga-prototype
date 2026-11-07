import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог услуг' },
  { to: '/status', label: 'Мои заявления' },
  { to: '/support', label: 'Поддержка' },
  { to: '/about', label: 'О портале' },
]

export function Layout() {
  return (
    <div className="min-h-screen flex bg-bg">
      <aside className="w-64 bg-navy text-white flex-shrink-0">
        <div className="p-5 font-bold text-xl">Е-Паслуга</div>
        <nav className="flex flex-col">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-5 py-3 text-sm hover:bg-white/10 ${
                  isActive ? 'bg-white/15 font-semibold' : ''
                }`
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
          <NavLink to="/login" className="text-navy font-semibold text-sm">
            Войти
          </NavLink>
        </header>
        <main className="flex-1 p-7">
          <Outlet />
        </main>
      </div>
    </div>
  )
}