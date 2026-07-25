import InstagramIcon from '@/components/icons/InstagramIcon'
import { business } from '@/data/business'
import styles from './BrandStory.module.css'

const highlights = [
  { title: 'Smash a la vista', text: 'Medallones finos, sellados al momento, con costra caramelizada.' },
  { title: 'Recetas de la casa', text: 'Salsas y aderezos propios en cada producto, sin atajos.' },
  { title: 'Pedí fácil', text: 'Armá tu pedido acá y confirmalo en un toque por WhatsApp.' },
]

export default function BrandStory() {
  return (
    <section className="section">
      <div className="container">
        <span className="section-eyebrow">Nuestra propuesta</span>
        <h2 className="section-title">{business.tagline}, todos los días de la semana que abrimos</h2>

        <div className={styles.grid}>
          {highlights.map((h) => (
            <div key={h.title} className={styles.card}>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>

        <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.instagramLink}>
          <InstagramIcon />
          Seguinos en Instagram {business.instagramHandle}
        </a>
      </div>
    </section>
  )
}
