import { useLocation } from 'react-router-dom'
import { services } from '../data/services'
import { categories } from '../data/categories'

export type Crumb = { label: string; href?: string }

export function useBreadcrumbs(): Crumb[] {
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)

  const crumbs: Crumb[] = [{ label: 'Главная', href: '/' }]

  if (pathname === '/catalog') {
    const catId = params.get('cat')
    const view = params.get('view')

    if (view === 'favs') {
      crumbs.push({ label: 'Избранные услуги' })
    } else if (catId) {
      const cat = categories.find((c) => c.id === catId)
      crumbs.push({ label: 'Каталог услуг', href: '/catalog?view=list' })
      crumbs.push({ label: cat?.title ?? 'Категория' })
    } else if (view === 'list') {
      crumbs.push({ label: 'Все услуги' })
    } else {
      crumbs.push({ label: 'Каталог услуг' })
    }
  } else if (pathname.startsWith('/service/')) {
    const id = pathname.replace('/service/', '')
    const svc = services.find((s) => s.id === id)
    crumbs.push({ label: 'Каталог услуг', href: '/catalog' })
    if (svc) {
      crumbs.push({
        label: svc.categoryTitle,
        href: `/catalog?cat=${svc.category}&view=list`,
      })
      crumbs.push({ label: svc.shortTitle })
    } else {
      crumbs.push({ label: 'Услуга' })
    }
  } else if (pathname === '/apps') {
    crumbs.push({ label: 'Мои услуги' })
  } else if (pathname === '/notifications') {
    crumbs.push({ label: 'Мои уведомления' })
  } else if (pathname === '/profile') {
    crumbs.push({ label: 'Личный кабинет' })
  } else if (pathname === '/support') {
    crumbs.push({ label: 'Поддержка' })
  } else if (pathname === '/about') {
    crumbs.push({ label: 'О портале' })
  } else if (pathname === '/login') {
    crumbs.push({ label: 'Вход' })
  }

  return crumbs
}