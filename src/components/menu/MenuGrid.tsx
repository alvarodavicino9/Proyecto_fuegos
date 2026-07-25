import type { MenuCategory, MenuItem } from '@/types/menu'
import MenuItemCard from './MenuItemCard'
import styles from './MenuGrid.module.css'

interface Props {
  items: MenuItem[]
  categories?: MenuCategory[]
  compact?: boolean
  emptyMessage?: string
  onSelectItem: (item: MenuItem) => void
}

export default function MenuGrid({ items, categories, compact, emptyMessage, onSelectItem }: Props) {
  if (items.length === 0) {
    return <p className={styles.empty}>{emptyMessage ?? 'Próximamente nuevos productos en esta categoría.'}</p>
  }

  return (
    <div className={compact ? `${styles.grid} ${styles.compactGrid}` : styles.grid}>
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          compact={compact}
          category={categories?.find((c) => c.id === item.categoryId)}
          onOpen={onSelectItem}
        />
      ))}
    </div>
  )
}
