import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { OrderRow } from '@/types/db'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './admin-shared.module.css'

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export default function AdminEstadisticasPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data)
        setLoading(false)
      })
  }, [])

  const stats = useMemo(() => {
    const valid = orders.filter((o) => o.status !== 'cancelado')
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)
    const monthStart = new Date(todayStart)
    monthStart.setDate(monthStart.getDate() - 30)

    const sumSince = (since: Date) =>
      valid.filter((o) => new Date(o.created_at) >= since).reduce((sum, o) => sum + o.total, 0)

    const countSince = (since: Date) => valid.filter((o) => new Date(o.created_at) >= since).length

    const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, {})

    const productCounts = new Map<string, number>()
    for (const order of valid) {
      for (const item of order.items) {
        productCounts.set(item.name, (productCounts.get(item.name) ?? 0) + item.quantity)
      }
    }
    const topProducts = Array.from(productCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    return {
      todaySales: sumSince(todayStart),
      todayOrders: countSince(todayStart),
      weekSales: sumSince(weekStart),
      monthSales: sumSince(monthStart),
      byStatus,
      topProducts,
    }
  }, [orders])

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Estadísticas</h1>
        <p className={styles.emptyState}>Conectá Supabase para ver estadísticas de ventas (ver .env.example).</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Estadísticas</h1>
          <p className={styles.pageSubtitle}>Calculadas a partir de los pedidos guardados (no incluye cancelados).</p>
        </div>
      </header>

      {loading ? (
        <p className={styles.loadingState}>Cargando…</p>
      ) : orders.length === 0 ? (
        <p className={styles.emptyState}>Todavía no hay pedidos para mostrar estadísticas.</p>
      ) : (
        <>
          <div className={styles.statGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Ventas hoy</p>
              <p className={styles.statValue}>{formatCurrency(stats.todaySales)}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Pedidos hoy</p>
              <p className={styles.statValue}>{stats.todayOrders}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Ventas últimos 7 días</p>
              <p className={styles.statValue}>{formatCurrency(stats.weekSales)}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>Ventas últimos 30 días</p>
              <p className={styles.statValue}>{formatCurrency(stats.monthSales)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Pedidos por estado</p>
            <div className={styles.actionsRow}>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <span key={status} className={styles.badge} style={{ background: 'var(--color-bg-elevated-2)', color: 'var(--color-text)' }}>
                  {status}: {count}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <p className={styles.cardTitle}>Productos más pedidos</p>
            {stats.topProducts.length === 0 ? (
              <p className={styles.emptyState}>Sin datos todavía.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Unidades vendidas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map(([name, count]) => (
                      <tr key={name}>
                        <td>{name}</td>
                        <td>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
