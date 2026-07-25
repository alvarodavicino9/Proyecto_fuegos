import type { MenuItem } from '@/types/menu'
import { formatCurrency } from '@/utils/formatCurrency'
import styles from './FeaturedItemCard.module.css'

interface Props {
  item: MenuItem
  onOpen: (item: MenuItem) => void
}

export default function FeaturedItemCard({ item, onOpen }: Props) {
  return (
    <article className={styles.card}>
      <button className={styles.cardButton} onClick={() => onOpen(item)} aria-label={`Ver ${item.name}`}>
        <div className={styles.mediaWrap}>
          <div
            className={styles.mediaImage}
            style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
          >
            {!item.image && <span className={styles.mediaPlaceholder}>Fuegos</span>}
          </div>
          <div className={styles.mediaOverlay} aria-hidden="true" />
          {item.tags?.[0] && <span className={styles.badge}>{item.tags[0]}</span>}
        </div>

        <div className={styles.body}>
          <h3 className={styles.name}>{item.name}</h3>
          <p className={styles.description}>{item.description}</p>

          <div className={styles.footerRow}>
            <span className={styles.price}>{formatCurrency(item.price)}</span>
            <span className={styles.link}>Ver más →</span>
          </div>
        </div>
      </button>
    </article>
  )
}
