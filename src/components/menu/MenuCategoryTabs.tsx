import type { MenuCategory, MenuCategoryId } from '@/types/menu'
import styles from './MenuCategoryTabs.module.css'

interface Props {
  categories: MenuCategory[]
  activeId: MenuCategoryId
  onChange: (id: MenuCategoryId) => void
}

export default function MenuCategoryTabs({ categories, activeId, onChange }: Props) {
  return (
    <div className={styles.tabs} role="tablist" aria-label="Categorías del menú">
      {categories.map((category) => (
        <button
          key={category.id}
          role="tab"
          aria-selected={category.id === activeId}
          className={category.id === activeId ? `${styles.tab} ${styles.active}` : styles.tab}
          onClick={() => onChange(category.id)}
        >
          {category.label}
        </button>
      ))}
    </div>
  )
}
