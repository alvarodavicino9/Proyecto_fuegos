import { useEffect, useState, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useSiteSettings } from '@/context/SiteSettingsContext'
import styles from './admin-shared.module.css'

const DAYS = [
  { value: 0, label: 'Dom' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mié' },
  { value: 4, label: 'Jue' },
  { value: 5, label: 'Vie' },
  { value: 6, label: 'Sáb' },
]

export default function AdminContenidoPage() {
  const { business, loading, refresh } = useSiteSettings()

  const [form, setForm] = useState(business)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    setForm(business)
  }, [business])

  function toggleDay(day: number) {
    setForm((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        openDays: prev.schedule.openDays.includes(day)
          ? prev.schedule.openDays.filter((d) => d !== day)
          : [...prev.schedule.openDays, day].sort(),
      },
    }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('site_settings')
      .update({
        name: form.name,
        tagline: form.tagline,
        short_description: form.shortDescription,
        instagram_handle: form.instagramHandle,
        instagram_url: form.instagramUrl,
        whatsapp_number: form.whatsappNumber,
        phone_display: form.phoneDisplay,
        address_street: form.address.street,
        address_city: form.address.city,
        address_province: form.address.province,
        address_postal_code: form.address.postalCode,
        address_country: form.address.country,
        hours_days: form.hours[0]?.days ?? '',
        hours_time: form.hours[0]?.time ?? '',
        closed_note: form.closedNote,
        schedule_open_days: form.schedule.openDays,
        schedule_opens: form.schedule.opens,
        schedule_closes: form.schedule.closes,
      })
      .eq('id', 1)

    setSaving(false)
    if (error) {
      setMessage('Error al guardar: ' + error.message)
      return
    }
    setMessage('Guardado ✓')
    refresh()
  }

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Contenido del sitio</h1>
        <p className={styles.emptyState}>Conectá Supabase para editar estos datos (ver .env.example).</p>
      </div>
    )
  }

  if (loading) {
    return <p className={styles.loadingState}>Cargando…</p>
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Contenido del sitio</h1>
          <p className={styles.pageSubtitle}>
            Horarios, dirección, redes y textos. Los cambios se reflejan en el sitio apenas guardás, sin redeployar.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className={styles.card}>
          <p className={styles.cardTitle}>Marca</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nombre del negocio</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label>Tagline</label>
              <input
                className={styles.input}
                value={form.tagline}
                onChange={(e) => setForm((f) => ({ ...f, tagline: e.target.value }))}
              />
            </div>
            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Descripción corta</label>
              <input
                className={styles.input}
                value={form.shortDescription}
                onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Contacto</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>WhatsApp (solo números, con código de país)</label>
              <input
                className={styles.input}
                value={form.whatsappNumber}
                onChange={(e) => setForm((f) => ({ ...f, whatsappNumber: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label>Teléfono a mostrar</label>
              <input
                className={styles.input}
                value={form.phoneDisplay}
                onChange={(e) => setForm((f) => ({ ...f, phoneDisplay: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label>Usuario de Instagram</label>
              <input
                className={styles.input}
                value={form.instagramHandle}
                onChange={(e) => setForm((f) => ({ ...f, instagramHandle: e.target.value }))}
              />
            </div>
            <div className={styles.field}>
              <label>Link de Instagram</label>
              <input
                className={styles.input}
                value={form.instagramUrl}
                onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Dirección</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Calle y número</label>
              <input
                className={styles.input}
                value={form.address.street}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))}
              />
            </div>
            <div className={styles.field}>
              <label>Ciudad</label>
              <input
                className={styles.input}
                value={form.address.city}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))}
              />
            </div>
            <div className={styles.field}>
              <label>Provincia</label>
              <input
                className={styles.input}
                value={form.address.province}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, province: e.target.value } }))}
              />
            </div>
            <div className={styles.field}>
              <label>Código postal</label>
              <input
                className={styles.input}
                value={form.address.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, postalCode: e.target.value } }))}
              />
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Horarios</p>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Texto de días (para mostrar)</label>
              <input
                className={styles.input}
                placeholder="Miércoles a Domingo"
                value={form.hours[0]?.days ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, hours: [{ days: e.target.value, time: f.hours[0]?.time ?? '' }] }))}
              />
            </div>
            <div className={styles.field}>
              <label>Texto de horario (para mostrar)</label>
              <input
                className={styles.input}
                placeholder="19:30 a 23:30"
                value={form.hours[0]?.time ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, hours: [{ days: f.hours[0]?.days ?? '', time: e.target.value }] }))}
              />
            </div>
            <div className={styles.field}>
              <label>Nota de cerrado</label>
              <input
                className={styles.input}
                placeholder="Lunes y martes cerrado"
                value={form.closedNote}
                onChange={(e) => setForm((f) => ({ ...f, closedNote: e.target.value }))}
              />
            </div>
          </div>

          <div className={styles.field} style={{ marginTop: 14 }}>
            <label>Días abiertos (para calcular "Abierto ahora" en vivo)</label>
            <div className={styles.actionsRow}>
              {DAYS.map((day) => (
                <label key={day.value} className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={form.schedule.openDays.includes(day.value)}
                    onChange={() => toggleDay(day.value)}
                  />
                  {day.label}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGrid} style={{ marginTop: 14 }}>
            <div className={styles.field}>
              <label>Hora de apertura</label>
              <input
                type="time"
                className={styles.input}
                value={form.schedule.opens}
                onChange={(e) => setForm((f) => ({ ...f, schedule: { ...f.schedule, opens: e.target.value } }))}
              />
            </div>
            <div className={styles.field}>
              <label>Hora de cierre</label>
              <input
                type="time"
                className={styles.input}
                value={form.schedule.closes}
                onChange={(e) => setForm((f) => ({ ...f, schedule: { ...f.schedule, closes: e.target.value } }))}
              />
            </div>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>
          {message && <p className={message.startsWith('Error') ? styles.errorText : styles.successText}>{message}</p>}
        </div>
      </form>
    </div>
  )
}
