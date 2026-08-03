// Avisos de "pedido nuevo" en el panel admin: cuenta los pedidos que
// todavía no viste, hace sonar un chime, cambia el título de la pestaña
// del navegador, y (si el dueño lo activa) dispara una notificación del
// sistema operativo aunque el panel esté en otra pestaña.

import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { playOrderChime } from '@/utils/orderChime'

const MUTE_KEY = 'fuegos-admin-sound-muted'
export const ADMIN_BASE_TITLE = 'Panel admin · Fuegos'

type NotificationPermissionState = NotificationPermission | 'unsupported'

interface OrderNotificationsValue {
  newCount: number
  markSeen: () => void
  muted: boolean
  toggleMuted: () => void
  testSound: () => void
  notifPermission: NotificationPermissionState
  requestNotificationPermission: () => Promise<void>
}

export function useOrderNotifications(): OrderNotificationsValue {
  const [newCount, setNewCount] = useState(0)
  const [muted, setMuted] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(MUTE_KEY) === '1'
  })
  const [notifPermission, setNotifPermission] = useState<NotificationPermissionState>(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )

  // Ref para leer el valor actual de "muted" dentro del callback de
  // realtime sin tener que recrear la suscripción cada vez que cambia.
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  // Guarda el título que tenía la pestaña antes de entrar al panel (el del
  // sitio público, definido en index.html), para devolverlo tal cual al
  // salir del panel — si no, el sitio se queda con el título del admin.
  const originalTitleRef = useRef<string | null>(null)
  useEffect(() => {
    if (originalTitleRef.current === null) originalTitleRef.current = document.title
    return () => {
      if (originalTitleRef.current !== null) document.title = originalTitleRef.current
    }
  }, [])

  useEffect(() => {
    document.title = newCount > 0 ? `(${newCount}) ${ADMIN_BASE_TITLE}` : ADMIN_BASE_TITLE
  }, [newCount])

  useEffect(() => {
    if (!isSupabaseConfigured) return

    const channel = supabase
      .channel('orders-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setNewCount((c) => c + 1)
        if (!mutedRef.current) playOrderChime()

        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          const newRow = (payload as { new?: Record<string, unknown> }).new
          const name = typeof newRow?.customer_name === 'string' ? newRow.customer_name : undefined
          new Notification('🔥 Nuevo pedido en Fuegos', {
            body: name ? `De ${name} — abrí el panel para verlo.` : 'Entró un pedido nuevo, revisá el panel.',
          })
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markSeen = useCallback(() => setNewCount(0), [])

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      window.localStorage.setItem(MUTE_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const testSound = useCallback(() => {
    playOrderChime()
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
  }, [])

  return { newCount, markSeen, muted, toggleMuted, testSound, notifPermission, requestNotificationPermission }
}
