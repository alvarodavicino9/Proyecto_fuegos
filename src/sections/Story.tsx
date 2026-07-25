import styles from './Story.module.css'

const photos = [
  { src: '/images/menu/smash-tecnica.jpg.png', alt: 'Técnica smash de Fuegos' },
  { src: '/images/menu/onion-cheddar.jpg.png', alt: 'Hamburguesa con cebolla caramelizada y cheddar' },
  { src: '/images/menu/napolitana-style.jpg.png', alt: 'Hamburguesa con lechuga y tomate' },
  { src: '/images/menu/crispy-onion.jpg.png', alt: 'Hamburguesa con cebolla crispy' },
]

export default function Story() {
  return (
    <section id="nosotros" className="section section-alt">
      <div className={`container ${styles.grid}`}>
        <div className={styles.text}>
          <span className="section-eyebrow">La técnica</span>
          <h2 className={`section-title ${styles.title}`}>
            Smash burger <span className="highlight">de verdad</span>
          </h2>
          <p className={styles.paragraph}>
            La técnica smash es simple pero exigente: medallón de carne fresca sobre plancha bien caliente,
            aplastado para maximizar el contacto con el hierro. El resultado es una costra dorada perfecta y un
            interior jugoso.
          </p>
          <p className={styles.paragraph}>
            Cada hamburguesa se arma al momento, con salsas y aderezos propios de la casa. Elegí tu favorita y
            personalizala como quieras.
          </p>
        </div>

        <div className={styles.photoGrid}>
          {photos.map((photo) => (
            <div key={photo.src} className={styles.photo} style={{ backgroundImage: `url(${photo.src})` }} role="img" aria-label={photo.alt} />
          ))}
        </div>
      </div>
    </section>
  )
}
