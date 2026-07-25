import type { MenuCategory, MenuItem } from '@/types/menu'
import { formatCurrency } from '@/utils/formatCurrency'
import { PlusIcon } from '../icons/PlusMinusIcons'
import styles from './MenuItemCard.module.css'

interface Props {
  item: MenuItem
  category?: MenuCategory
  compact?: boolean
  onOpen: (item: MenuItem) => void
}

export default function MenuItemCard({ item, category, compact = false, onOpen }: Props) {
  return (
    <article className={compact ? `${styles.card} ${styles.compact}` : styles.card}>
      <button className={styles.cardButton} onClick={() => onOpen(item)} aria-label={`Personalizar ${item.name}`}>
        <div className={styles.media} style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}>
          {!item.image && <span className={styles.mediaPlaceholder}>Fuegos</span>}

          {category && <span className={styles.categoryBadge}>{category.label}</span>}

          {item.tags?.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}

          <span className={styles.quickAdd} aria-hidden="true">
            <PlusIcon size={18} />
          </span>
        </div>

        <div className={styles.body}>
          <div className={styles.headRow}>
            <h3 className={styles.name}>{item.name}</h3>
            <span className={styles.price}>{formatCurrency(item.price)}</span>
          </div>
          <p className={styles.description}>{item.description}</p>
        </div>
      </button>
    </article>
  )
}
