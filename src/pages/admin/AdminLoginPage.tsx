import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Logo from '@/components/brand/Logo'
import { useAdminAuth } from '@/context/AdminAuthContext'
import { isSupabaseConfigured } from '@/lib/supabase'
import styles from './AdminLoginPage.module.css'

export default function AdminLoginPage() {
  const { session, loading, signIn } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError('No pudimos iniciar sesión. Revisá el email y la contraseña.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <Logo variant="compact" />
        <h1 className={styles.title}>Panel de administración</h1>
        <p className={styles.subtitle}>Ingresá con tu cuenta para gestionar pedidos, menú y contenido del sitio.</p>

        {!isSupabaseConfigured && (
          <p className={styles.warning}>
            Todavía no configuraste Supabase (falta el archivo .env.local). El login no va a funcionar hasta que lo
            hagas — ver supabase/schema.sql y .env.example.
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              autoComplete="username"
            />
          </label>
          <label className={styles.field}>
            <span>Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}
