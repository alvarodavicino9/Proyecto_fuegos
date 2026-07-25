import { useMemo, type CSSProperties } from 'react'
import styles from './Embers.module.css'

interface Props {
  count?: number
  bottom?: string
}

interface EmberConfig {
  left: number
  size: number
  duration: number
  delay: number
  drift: number
}

function randEmber(): EmberConfig {
  return {
    left: Math.random() * 92 + 2,
    size: Math.round(3 + Math.random() * 5),
    duration: 5 + Math.random() * 4,
    delay: Math.random() * 8,
    drift: Math.round((Math.random() - 0.5) * 80),
  }
}

// Partículas de "brasas" flotantes que suben con drift horizontal aleatorio.
// Usadas de fondo en el Hero y en el CTA final.
export default function Embers({ count = 14, bottom = '6%' }: Props) {
  const embers = useMemo(() => Array.from({ length: count }, randEmber), [count])

  return (
    <>
      {embers.map((ember, i) => {
        const style = {
          left: `${ember.left}%`,
          bottom,
          width: `${ember.size}px`,
          height: `${ember.size}px`,
          animationDuration: `${ember.duration}s`,
          animationDelay: `${ember.delay}s`,
          '--drift': `${ember.drift}px`,
        } as CSSProperties

        return <div key={i} className={styles.ember} style={style} aria-hidden="true" />
      })}
    </>
  )
}
