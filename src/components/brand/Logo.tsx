import styles from './Logo.module.css'

interface Props {
  variant?: 'full' | 'compact' | 'hero'
  className?: string
}

const variantClass = {
  full: 'logoFull',
  compact: 'logoCompact',
  hero: 'logoHero',
} as const

// Logo real de Fuegos (public/images/brand/logo-gold.png.png). Se aplica
// mix-blend-mode para que el fondo negro del archivo se funda con el fondo
// oscuro del sitio y solo se vea la tipografía dorada.
export default function Logo({ variant = 'full', className }: Props) {
  return (
    <img
      src="/images/brand/logo-gold.png.png"
      alt="Fuegos"
      className={[styles[variantClass[variant]], className].filter(Boolean).join(' ')}
    />
  )
}
