import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '@/types/menu'
import { categories, menuItems } from '@/data/menu'
import FeaturedItemCard from '@/components/menu/FeaturedItemCard'
import ProductModal from '@/components/menu/ProductModal'
import Button from '@/components/ui/Button'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './FeaturedMenu.module.css'

export default function FeaturedMenu() {
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const { ref, revealed } = useScrollReveal<HTMLElement>()

  const featured = useMemo(
    () => menuItems.filter((item) => item.tags?.includes('más pedida') || item.tags?.includes('especial')),
    [],
  )

  const selectedCategory = selectedItem ? categories.find((c) => c.id === selectedItem.categoryId) : undefined

  return (
    <section ref={ref} className={`section ${styles.section} ${revealed ? styles.revealed : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Lo más pedido</span>
          <h2 className="section-title">
            Directo a la <span className="highlight">plancha</span>
          </h2>
          <p className="section-subtitle">
            Los clásicos de siempre, con receta propia de la casa. Tocá cualquiera para ver el detalle y sumarlo a tu
            pedido.
          </p>
        </div>

        <div className={styles.grid}>
          {featured.map((item) => (
            <FeaturedItemCard key={item.id} item={item} onOpen={setSelectedItem} />
          ))}
        </div>

        <div className={styles.cta}>
          <Button variant="outline" onClick={() => navigate('/menu')}>
            Ver menú completo →
          </Button>
        </div>
      </div>

      {selectedItem && (
        <ProductModal item={selectedItem} category={selectedCategory} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  )
}
