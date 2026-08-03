import { useEffect, useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { DeliveryZoneRow, DeliverySlotRow } from '@/types/db'
import styles from './admin-shared.module.css'

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<DeliveryZoneRow[]>([])
  const [slots, setSlots] = useState<DeliverySlotRow[]>([])
  const [loading, setLoading] = useState(true)

  const [zoneName, setZoneName] = useState('')
  const [zoneCost, setZoneCost] = useState('')
  const [slotLabel, setSlotLabel] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const [zonesRes, slotsRes] = await Promise.all([
      supabase.from('delivery_zones').select('*').order('sort_order', { ascending: true }),
      supabase.from('delivery_slots').select('*').order('sort_order', { ascending: true }),
    ])
    if (zonesRes.data) setZones(zonesRes.data)
    if (slotsRes.data) setSlots(slotsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAddZone(e: FormEvent) {
    e.preventDefault()
    if (!zoneName.trim()) return
    setSaving(true)
    await supabase.from('delivery_zones').insert({
      name: zoneName.trim(),
      cost: Number(zoneCost) || 0,
      active: true,
      sort_order: zones.length,
    })
    setSaving(false)
    setZoneName('')
    setZoneCost('')
    load()
  }

  async function handleAddSlot(e: FormEvent) {
    e.preventDefault()
    if (!slotLabel.trim()) return
    setSaving(true)
    await supabase.from('delivery_slots').insert({ label: slotLabel.trim(), active: true, sort_order: slots.length })
    setSaving(false)
    setSlotLabel('')
    load()
  }

  async function toggleZone(zone: DeliveryZoneRow) {
    setZones((prev) => prev.map((z) => (z.id === zone.id ? { ...z, active: !z.active } : z)))
    await supabase.from('delivery_zones').update({ active: !zone.active }).eq('id', zone.id)
  }

  async function toggleSlot(slot: DeliverySlotRow) {
    setSlots((prev) => prev.map((s) => (s.id === slot.id ? { ...s, active: !s.active } : s)))
    await supabase.from('delivery_slots').update({ active: !slot.active }).eq('id', slot.id)
  }

  async function updateZoneCost(zone: DeliveryZoneRow, cost: number) {
    await supabase.from('delivery_zones').update({ cost }).eq('id', zone.id)
    load()
  }

  async function deleteZone(zone: DeliveryZoneRow) {
    if (!window.confirm(`¿Borrar la zona "${zone.name}"?`)) return
    await supabase.from('delivery_zones').delete().eq('id', zone.id)
    load()
  }

  async function deleteSlot(slot: DeliverySlotRow) {
    if (!window.confirm(`¿Borrar el horario "${slot.label}"?`)) return
    await supabase.from('delivery_slots').delete().eq('id', slot.id)
    load()
  }

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Delivery</h1>
        <p className={styles.emptyState}>Conectá Supabase para configurar zonas y horarios (ver .env.example).</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Delivery</h1>
          <p className={styles.pageSubtitle}>
            Solo las zonas y horarios "activos" aparecen para elegir en el carrito del sitio.
          </p>
        </div>
      </header>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Zonas de envío</p>

        {loading ? (
          <p className={styles.loadingState}>Cargando…</p>
        ) : zones.length === 0 ? (
          <p className={styles.emptyState}>Todavía no cargaste zonas.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Zona</th>
                  <th>Costo de envío</th>
                  <th>Activa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone) => (
                  <tr key={zone.id}>
                    <td>{zone.name}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        className={styles.input}
                        style={{ maxWidth: 140 }}
                        defaultValue={zone.cost}
                        onBlur={(e) => {
                          const value = Number(e.target.value) || 0
                          if (value !== zone.cost) updateZoneCost(zone, value)
                        }}
                      />
                    </td>
                    <td>
                      <button className={styles.toggle} type="button" onClick={() => toggleZone(zone)}>
                        <span className={`${styles.toggleTrack} ${zone.active ? styles.toggleTrackOn : ''}`}>
                          <span className={`${styles.toggleThumb} ${zone.active ? styles.toggleThumbOn : ''}`} />
                        </span>
                        {zone.active ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td>
                      <button className={styles.buttonDanger} onClick={() => deleteZone(zone)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form className={styles.actionsRow} style={{ marginTop: 14 }} onSubmit={handleAddZone}>
          <input
            className={styles.input}
            style={{ maxWidth: 220 }}
            placeholder="Nombre de la zona"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
          />
          <input
            type="number"
            min={0}
            className={styles.input}
            style={{ maxWidth: 140 }}
            placeholder="Costo"
            value={zoneCost}
            onChange={(e) => setZoneCost(e.target.value)}
          />
          <button className={`${styles.button} ${styles.buttonPrimary}`} disabled={saving}>
            Agregar zona
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Horarios de entrega</p>

        {loading ? (
          <p className={styles.loadingState}>Cargando…</p>
        ) : slots.length === 0 ? (
          <p className={styles.emptyState}>Todavía no cargaste horarios.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Horario</th>
                  <th>Activo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.label}</td>
                    <td>
                      <button className={styles.toggle} type="button" onClick={() => toggleSlot(slot)}>
                        <span className={`${styles.toggleTrack} ${slot.active ? styles.toggleTrackOn : ''}`}>
                          <span className={`${styles.toggleThumb} ${slot.active ? styles.toggleThumbOn : ''}`} />
                        </span>
                        {slot.active ? 'Disponible' : 'No disponible'}
                      </button>
                    </td>
                    <td>
                      <button className={styles.buttonDanger} onClick={() => deleteSlot(slot)}>
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form className={styles.actionsRow} style={{ marginTop: 14 }} onSubmit={handleAddSlot}>
          <input
            className={styles.input}
            style={{ maxWidth: 220 }}
            placeholder="Ej: 20:00 a 21:00"
            value={slotLabel}
            onChange={(e) => setSlotLabel(e.target.value)}
          />
          <button className={`${styles.button} ${styles.buttonPrimary}`} disabled={saving}>
            Agregar horario
          </button>
        </form>
        <p className={styles.hint}>
          Desactivá un horario (ej: si ya está lleno) y desaparece de las opciones del carrito al instante, sin
          tocar nada más.
        </p>
      </div>
    </div>
  )
}
