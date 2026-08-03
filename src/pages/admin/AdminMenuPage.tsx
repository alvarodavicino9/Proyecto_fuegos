import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CategoryRow, ProductRow } from '@/types/db'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './admin-shared.module.css'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

interface ProductFormState {
  id: string
  categoryId: string
  name: string
  description: string
  price: string
  imageUrl: string
  tags: string
  ingredients: string
}

const EMPTY_FORM: ProductFormState = {
  id: '',
  categoryId: '',
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  tags: '',
  ingredients: '',
}

function rowToForm(row: ProductRow): ProductFormState {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: String(row.price),
    imageUrl: row.image_url ?? '',
    tags: row.tags.join(', '),
    ingredients: row.ingredients.join(', '),
  }
}

export default function AdminMenuPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)

  const [newCategoryLabel, setNewCategoryLabel] = useState('')
  const [categorySaving, setCategorySaving] = useState(false)

  const [editingProductId, setEditingProductId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function load() {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    const [categoriesRes, productsRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('products').select('*').order('sort_order', { ascending: true }),
    ])
    if (categoriesRes.data) setCategories(categoriesRes.data)
    if (productsRes.data) setProducts(productsRes.data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleAddCategory(e: FormEvent) {
    e.preventDefault()
    if (!newCategoryLabel.trim()) return
    setCategorySaving(true)
    const id = slugify(newCategoryLabel)
    const { error } = await supabase
      .from('categories')
      .insert({ id, label: newCategoryLabel.trim(), sort_order: categories.length })
    setCategorySaving(false)
    if (error) {
      alert('No se pudo crear la categoría: ' + error.message)
      return
    }
    setNewCategoryLabel('')
    load()
  }

  async function handleRenameCategory(id: string, label: string) {
    await supabase.from('categories').update({ label }).eq('id', id)
    load()
  }

  async function handleDeleteCategory(category: CategoryRow) {
    const productsInCategory = products.filter((p) => p.category_id === category.id)
    const confirmMsg =
      productsInCategory.length > 0
        ? `"${category.label}" tiene ${productsInCategory.length} producto(s). Al borrarla se borran también esos productos. ¿Continuar?`
        : `¿Borrar la categoría "${category.label}"?`
    if (!window.confirm(confirmMsg)) return
    await supabase.from('categories').delete().eq('id', category.id)
    load()
  }

  function startNewProduct() {
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? '' })
    setEditingProductId('new')
    setFormError(null)
  }

  function startEditProduct(product: ProductRow) {
    setForm(rowToForm(product))
    setEditingProductId(product.id)
    setFormError(null)
  }

  function cancelEdit() {
    setEditingProductId(null)
    setForm(EMPTY_FORM)
    setFormError(null)
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `products/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('menu-images').upload(path, file, { upsert: false })
    setUploading(false)
    if (error) {
      alert('No se pudo subir la imagen: ' + error.message)
      return
    }
    const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
    setForm((prev) => ({ ...prev, imageUrl: data.publicUrl }))
  }

  async function handleSaveProduct(e: FormEvent) {
    e.preventDefault()
    setFormError(null)

    if (!form.categoryId) {
      setFormError('Elegí una categoría.')
      return
    }
    const price = Number(form.price)
    if (!form.name.trim() || Number.isNaN(price) || price < 0) {
      setFormError('Completá el nombre y un precio válido.')
      return
    }

    const payload = {
      category_id: form.categoryId,
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      image_url: form.imageUrl || null,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      ingredients: form.ingredients
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    setSaving(true)

    if (editingProductId === 'new') {
      const id = form.id.trim() || slugify(form.name)
      if (products.some((p) => p.id === id)) {
        setSaving(false)
        setFormError('Ya existe un producto con ese identificador. Cambialo.')
        return
      }
      const { error } = await supabase.from('products').insert({
        id,
        ...payload,
        active: true,
        sort_order: products.filter((p) => p.category_id === form.categoryId).length,
      })
      setSaving(false)
      if (error) {
        setFormError('No se pudo crear: ' + error.message)
        return
      }
    } else if (editingProductId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProductId)
      setSaving(false)
      if (error) {
        setFormError('No se pudo guardar: ' + error.message)
        return
      }
    }

    cancelEdit()
    load()
  }

  async function toggleActive(product: ProductRow) {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p)))
    await supabase.from('products').update({ active: !product.active }).eq('id', product.id)
  }

  async function handleDeleteProduct(product: ProductRow) {
    if (!window.confirm(`¿Borrar "${product.name}"?`)) return
    await supabase.from('products').delete().eq('id', product.id)
    load()
  }

  if (!isSupabaseConfigured) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Menú</h1>
        <p className={styles.emptyState}>Conectá Supabase para poder editar el menú desde acá (ver .env.example).</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Menú</h1>
          <p className={styles.pageSubtitle}>Categorías, productos, precios, fotos y disponibilidad.</p>
        </div>
      </header>

      <div className={styles.card}>
        <p className={styles.cardTitle}>Categorías</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Productos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <input
                      className={styles.input}
                      defaultValue={cat.label}
                      onBlur={(e) => e.target.value.trim() && e.target.value !== cat.label && handleRenameCategory(cat.id, e.target.value.trim())}
                    />
                  </td>
                  <td>{products.filter((p) => p.category_id === cat.id).length}</td>
                  <td>
                    <button className={styles.buttonDanger} onClick={() => handleDeleteCategory(cat)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className={styles.actionsRow} style={{ marginTop: 14 }} onSubmit={handleAddCategory}>
          <input
            className={styles.input}
            style={{ maxWidth: 260 }}
            placeholder="Nueva categoría (ej: Postres)"
            value={newCategoryLabel}
            onChange={(e) => setNewCategoryLabel(e.target.value)}
          />
          <button className={`${styles.button} ${styles.buttonPrimary}`} disabled={categorySaving}>
            Agregar categoría
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.pageHeader} style={{ margin: 0 }}>
          <p className={styles.cardTitle} style={{ marginBottom: 0 }}>
            Productos
          </p>
          {editingProductId === null && (
            <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={startNewProduct}>
              + Nuevo producto
            </button>
          )}
        </div>

        {editingProductId !== null && (
          <form className={styles.formGrid} style={{ marginTop: 16, marginBottom: 20 }} onSubmit={handleSaveProduct}>
            {editingProductId === 'new' && (
              <div className={styles.field}>
                <label>Identificador (opcional)</label>
                <input
                  className={styles.input}
                  placeholder="se genera solo desde el nombre"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: slugify(e.target.value) }))}
                />
              </div>
            )}

            <div className={styles.field}>
              <label>Categoría</label>
              <select
                className={styles.select}
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Nombre</label>
              <input
                className={styles.input}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label>Precio</label>
              <input
                type="number"
                min={0}
                className={styles.input}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Descripción</label>
              <textarea
                className={styles.textarea}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label>Etiquetas (separadas por coma)</label>
              <input
                className={styles.input}
                placeholder="más pedida, especial"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label>Ingredientes para "quitar" (separados por coma)</label>
              <input
                className={styles.input}
                placeholder="Cheddar, Cebolla"
                value={form.ingredients}
                onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))}
              />
            </div>

            <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
              <label>Foto</label>
              <div className={styles.actionsRow}>
                {form.imageUrl && <div className={styles.thumb} style={{ backgroundImage: `url(${form.imageUrl})` }} />}
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={uploading} />
              </div>
              {uploading && <p className={styles.hint}>Subiendo imagen…</p>}
            </div>

            {formError && (
              <p className={styles.errorText} style={{ gridColumn: '1 / -1' }}>
                {formError}
              </p>
            )}

            <div className={styles.actionsRow} style={{ gridColumn: '1 / -1' }}>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`} disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar producto'}
              </button>
              <button type="button" className={styles.button} onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className={styles.loadingState}>Cargando menú…</p>
        ) : (
          categories.map((cat) => {
            const items = products.filter((p) => p.category_id === cat.id)
            if (items.length === 0) return null
            return (
              <div key={cat.id} style={{ marginTop: 18 }}>
                <p className={styles.cardTitle}>{cat.label}</p>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Disponible</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div
                              className={styles.thumb}
                              style={product.image_url ? { backgroundImage: `url(${product.image_url})` } : undefined}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>{formatCurrency(product.price)}</td>
                          <td>
                            <button
                              className={styles.toggle}
                              onClick={() => toggleActive(product)}
                              type="button"
                            >
                              <span className={`${styles.toggleTrack} ${product.active ? styles.toggleTrackOn : ''}`}>
                                <span className={`${styles.toggleThumb} ${product.active ? styles.toggleThumbOn : ''}`} />
                              </span>
                              {product.active ? 'Disponible' : 'Agotado'}
                            </button>
                          </td>
                          <td>
                            <div className={styles.actionsRow}>
                              <button className={styles.button} onClick={() => startEditProduct(product)}>
                                Editar
                              </button>
                              <button className={styles.buttonDanger} onClick={() => handleDeleteProduct(product)}>
                                Borrar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
