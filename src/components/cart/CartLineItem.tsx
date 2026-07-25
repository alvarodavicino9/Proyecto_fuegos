import type { CartLine } from '@/types/cart'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCart } from '@/context/CartContext'
import { getSizeOption } from '@/data/pricing'
import { PlusIcon, MinusIcon } from '../icons/PlusMinusIcons'
import styles from './CartLineItem.module.css'

interface Props {
  line: CartLine
}

export default function CartLineItem({ line }: Props) {
  const { increment, decrement, removeLine } = useCart()

  const details: string[] = []
  if (line.size) details.push(getSizeOption(line.size).label)
  if (line.extras.length > 0) details.push(`+ ${line.extras.map((e) => e.name).join(', ')}`)
  if (line.removedIngredients.length > 0) details.push(`sin ${line.removedIngredients.join(', ')}`)
  if (line.itemNotes) details.push(`"${line.itemNotes}"`)

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <p className={styles.name}>{line.item.name}</p>
        {details.length > 0 && <p className={styles.details}>{details.join(' · ')}</p>}
        <p className={styles.unitPrice}>{formatCurrency(line.unitPrice)} c/u</p>
      </div>

      <div className={styles.quantity}>
        <button onClick={() => decrement(line.lineId)} aria-label={`Restar ${line.item.name}`}>
          <MinusIcon size={14} />
        </button>
        <span>{line.quantity}</span>
        <button onClick={() => increment(line.lineId)} aria-label={`Sumar ${line.item.name}`}>
          <PlusIcon size={14} />
        </button>
      </div>

      <div className={styles.lineTotal}>
        <span>{formatCurrency(line.unitPrice * line.quantity)}</span>
        <button className={styles.remove} onClick={() => removeLine(line.lineId)} aria-label={`Quitar ${line.item.name}`}>
          Quitar
        </button>
      </div>
    </div>
  )
}
