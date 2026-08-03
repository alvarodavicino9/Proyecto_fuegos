import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'
import styles from './admin-shared.module.css'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAdminAuth()

  if (loading) {
    return <p className={styles.loadingState}>Verificando sesión…</p>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
