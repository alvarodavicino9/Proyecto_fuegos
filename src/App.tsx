import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SiteSettingsProvider } from './context/SiteSettingsContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import NosotrosPage from './pages/NosotrosPage'
import ContactoPage from './pages/ContactoPage'
import ScrollToTop from './components/layout/ScrollToTop'

// Todo el panel admin se separa en su propio chunk: un cliente que solo
// quiere pedir una hamburguesa nunca debería descargar el código del CRUD
// de menú, delivery, etc. Ese JS recién se pide cuando alguien entra a
// /admin/*.
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('./pages/admin/ProtectedRoute'))
const AdminPedidosPage = lazy(() => import('./pages/admin/AdminPedidosPage'))
const AdminMenuPage = lazy(() => import('./pages/admin/AdminMenuPage'))
const AdminDeliveryPage = lazy(() => import('./pages/admin/AdminDeliveryPage'))
const AdminContenidoPage = lazy(() => import('./pages/admin/AdminContenidoPage'))
const AdminEstadisticasPage = lazy(() => import('./pages/admin/AdminEstadisticasPage'))

function AdminFallback() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a8a39a', fontFamily: 'Inter, sans-serif' }}>
      Cargando panel…
    </div>
  )
}

function App() {
  return (
    <SiteSettingsProvider>
      <AdminAuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="nosotros" element={<NosotrosPage />} />
              <Route path="contacto" element={<ContactoPage />} />
            </Route>

            <Route
              path="admin/login"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <AdminLoginPage />
                </Suspense>
              }
            />
            <Route
              path="admin"
              element={
                <Suspense fallback={<AdminFallback />}>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </Suspense>
              }
            >
              <Route
                index
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminPedidosPage />
                  </Suspense>
                }
              />
              <Route
                path="menu"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminMenuPage />
                  </Suspense>
                }
              />
              <Route
                path="delivery"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminDeliveryPage />
                  </Suspense>
                }
              />
              <Route
                path="contenido"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminContenidoPage />
                  </Suspense>
                }
              />
              <Route
                path="estadisticas"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminEstadisticasPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </CartProvider>
      </AdminAuthProvider>
    </SiteSettingsProvider>
  )
}

export default App
