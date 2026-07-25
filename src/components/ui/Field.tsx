import type { ReactNode } from 'react'
import styles from './Field.module.css'

interface Props {
  label: string
  children: ReactNode
  htmlFor?: string
}

export default function Field({ label, children, htmlFor }: Props) {
  return (
    <label className={styles.field} htmlFor={htmlFor}>
      <span className={styles.label}>{label}</span>
      {children}
    </label>
  )
}
