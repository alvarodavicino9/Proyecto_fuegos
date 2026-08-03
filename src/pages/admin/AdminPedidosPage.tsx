import { useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { OrderRow, OrderStatus } from '@/types/db'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './admin-shared.module.css'

const STATUS_OPTIONS: { value: OrderStatus; label: string; badgeClass: keyof typeof styles }[] = [
  { value: 'nuevo', label: 'Nuevo', badgeClass: 'badgeNuevo' },
  { value: 'preparando', label: 'Preparando', badgeClass: 'badgePreparando' },
  { value: 'en_camino', label: 'En camino', badgeClass: 'badgeEnCamino' },
  { value: 'entregado', label: 'Entregado', badgeClass: 'badgeEntregado' },
  { value: 'cancelado', label: 'Cancelado', badgeClass: 'badgeCancelado' },
]

function statusMeta(status: OrderStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status) ?? STATUS_OPTIONS[0]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminPedidosPage() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'todos'>('todos')

  async function load() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
    if (!isSupabaseConfigured) return

    // Se actualiza solo apenas entra un pedido nuevo o cambia de estado,
    // sin tener que refrescar la página (Supabase Realtime).
    const channel = supabase
      .channel('orders-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) load()
  }

  const filtered = useMemo(
    () => (filter === 'todos' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  )

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pedidos</h1>
          <p className={styles.pageSubtitle}>
            Se guardan solos apenas un cliente confirma el pedido por WhatsApp desde el sitio.
          </p>
        </div>
      </header>

      {!isSupabaseConfigured ? (
        <p className={styles.emptyState}>Conectá Supabase para empezar a recibir pedidos acá (ver .env.example).</p>
      ) : (
        <>
          <div className={styles.filterRow}>
            <button
              className={filter === 'todos' ? styles.filterButtonActive : styles.filterButton}
              onClick={() => setFilter('todos')}
            >
              Todos ({orders.length})
            </button>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                className={filter === s.value ? styles.filterButtonActive : styles.filterButton}
                onClick={() => setFilter(s.value)}
              >
                {s.label} ({orders.filter((o) => o.status === s.value).length})
              </button>
            ))}
          </div>

          <div className={styles.card}>
            {loading ? (
              <p className={styles.loadingState}>Cargando pedidos…</p>
            ) : filtered.length === 0 ? (
              <p className={styles.emptyState}>No hay pedidos por ahora.</p>
            ) : (
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Productos</th>
                      <th>Entrega</th>
                      <th>Pago</th>
                      <th>Total</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order) => (
                      <tr key={order.id}>
                        <td>{formatDate(order.created_at)}</td>
                        <td>
                          {order.customer_name}
                          {order.customer_phone && <div className={styles.hint}>{order.customer_phone}</div>}
                        </td>
                        <td>
                          {order.items.map((item, i) => (
                            <div key={i}>
                              {item.quantity}× {item.name}
                            </div>
                          ))}
                          {order.notes && <div className={styles.hint}>"{order.notes}"</div>}
                        </td>
                        <td>
                          {order.delivery_method === 'envio' ? '🛵 Delivery' : '🏠 Retiro'}
                          {order.address && <div className={styles.hint}>{order.address}</div>}
                          {order.delivery_zone_name && <div className={styles.hint}>{order.delivery_zone_name}</div>}
                          {order.delivery_slot_label && <div className={styles.hint}>{order.delivery_slot_label}</div>}
                        </td>
                        <td>{order.payment_method === 'efectivo' ? 'Efectivo' : 'Transferencia'}</td>
                        <td>{formatCurrency(order.total)}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[statusMeta(order.status).badgeClass]}`}>
                            {statusMeta(order.status).label}
                          </span>
                          <select
                            className={styles.select}
                            style={{ marginTop: 8 }}
                            value={order.status}
                            onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>
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
