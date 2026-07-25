import type { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  icon?: ReactNode
}

export default function Button({ variant = 'primary', icon, children, className, ...rest }: Props) {
  const variantClass = variant === 'primary' ? styles.primary : variant === 'outline' ? styles.outline : styles.ghost
  return (
    <button className={[styles.button, variantClass, className].filter(Boolean).join(' ')} {...rest}>
      {icon}
      {children}
    </button>
  )
}
