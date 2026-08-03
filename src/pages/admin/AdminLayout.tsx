import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import Logo from '@/components/brand/Logo'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { useOrderNotifications } from '@/hooks/useOrderNotifications'
import { isSupabaseConfigured } from '@/lib/supabase'
import styles from './AdminLayout.module.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Pedidos', end: true },
  { to: '/admin/menu', label: 'Menú' },
  { to: '/admin/delivery', label: 'Delivery' },
  { to: '/admin/contenido', label: 'Contenido del sitio' },
  { to: '/admin/estadisticas', label: 'Estadísticas' },
]

export default function AdminLayout() {
  const { signOut } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { newCount, markSeen, muted, toggleMuted, testSound, notifPermission, requestNotificationPermission } =
    useOrderNotifications()

  // Apenas el dueño entra a la pestaña de Pedidos, damos por vistos los
  // pedidos nuevos (se apaga el número en el menú y el título de la pestaña).
  useEffect(() => {
    if (location.pathname === '/admin') markSeen()
  }, [location.pathname, markSeen])

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Logo variant="compact" />
          <span className={styles.brandLabel}>Panel admin</span>
        </div>

        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
            >
              {item.label}
              {item.to === '/admin' && newCount > 0 && <span className={styles.navBadge}>{newCount}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          {!isSupabaseConfigured && <p className={styles.warning}>Supabase no configurado</p>}

          <div className={styles.notifyBlock}>
            <button className={styles.soundToggle} onClick={toggleMuted} type="button">
              {muted ? '🔕 Sonido silenciado' : '🔔 Aviso de pedidos activado'}
            </button>
            <button className={styles.testSound} onClick={testSound} type="button">
              Probar sonido
            </button>
            {notifPermission === 'default' && (
              <button className={styles.notifButton} onClick={requestNotificationPermission} type="button">
                Activar avisos del navegador
              </button>
            )}
            {notifPermission === 'denied' && (
              <p className={styles.notifDenied}>
                Bloqueaste las notificaciones del navegador. Activalas desde la config del sitio si querés recibir
                avisos aunque el panel esté en otra pestaña.
              </p>
            )}
          </div>

          <NavLink to="/" className={styles.viewSite}>
            ← Ver el sitio
          </NavLink>
          <button className={styles.signOut} onClick={handleSignOut}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
