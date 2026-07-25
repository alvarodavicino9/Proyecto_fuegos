import { useMemo, useState } from 'react'
import type { MenuCategoryId, MenuItem } from '@/types/menu'
import { categories, menuItems } from '@/data/menu'
import MenuCategoryTabs from '@/components/menu/MenuCategoryTabs'
import MenuGrid from '@/components/menu/MenuGrid'
import ProductModal from '@/components/menu/ProductModal'
import styles from './MenuSection.module.css'

export default function MenuSection() {
  const [activeId, setActiveId] = useState<MenuCategoryId>(categories[0].id)
  const [search, setSearch] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const items = useMemo(() => {
    const query = search.trim().toLowerCase()
    return menuItems.filter((item) => {
      const matchesCategory = item.categoryId === activeId
      const matchesSearch =
        query.length === 0 || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [activeId, search])

  const selectedCategory = selectedItem ? categories.find((c) => c.id === selectedItem.categoryId) : undefined

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Menú completo</span>
          <h2 className="section-title">
            Nuestro <span className="highlight">menú</span>
          </h2>
          <p className="section-subtitle">
            Tocá cualquier producto para personalizarlo (tamaño, extras, ingredientes) y sumarlo a tu pedido. Precios
            sujetos a confirmación final del dueño.
          </p>
        </div>

        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.search}
            placeholder="Buscar en el menú..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar productos"
          />
        </div>

        <MenuCategoryTabs categories={categories} activeId={activeId} onChange={setActiveId} />

        <MenuGrid
          items={items}
          categories={categories}
          emptyMessage="No encontramos productos con esa búsqueda."
          onSelectItem={setSelectedItem}
        />
      </div>

      {selectedItem && (
        <ProductModal item={selectedItem} category={selectedCategory} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  )
}
