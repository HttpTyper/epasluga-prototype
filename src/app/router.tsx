import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { HomePage } from '../features/home/HomePage'
import { CatalogPage } from '../features/catalog/CatalogPage'
import { ServicePage } from '../features/service/ServicePage'
import { LoginPage } from '../features/auth/LoginPage'
import { StatusPage } from '../features/status/StatusPage'
import { SupportPage } from '../features/support/SupportPage'
import { AboutPage } from '../features/about/AboutPage'
import { ProfilePage } from '../features/profile/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'service/:id', element: <ServicePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'status/:id?', element: <StatusPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
])
