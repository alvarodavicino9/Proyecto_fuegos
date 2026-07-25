import type { ReactNode } from 'react'
import { useMagnet } from '@/hooks/useMagnet'
import styles from './MagnetWrap.module.css'

interface Props {
  children: ReactNode
}

// Envoltorio que le da a su hijo (normalmente un <Button>) el efecto
// "magnet" del prototipo: se desplaza hacia el cursor al pasar el mouse.
export default function MagnetWrap({ children }: Props) {
  const { style, onMouseMove, onMouseLeave } = useMagnet()

  return (
    <div className={styles.wrap} style={style} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      {children}
    </div>
  )
}
