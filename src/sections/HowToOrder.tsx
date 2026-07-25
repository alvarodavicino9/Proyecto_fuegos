import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import MagnetWrap from '@/components/ui/MagnetWrap'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './HowToOrder.module.css'

const steps = [
  { emoji: '🍔', title: 'Elegí tu producto', text: 'Recorré el menú por categorías y elegí lo que más se te antoje.' },
  { emoji: '🛒', title: 'Armá tu pedido', text: 'Sumá todos los productos que quieras a un mismo pedido.' },
  { emoji: '📲', title: 'Confirmá por WhatsApp', text: 'Se genera el detalle completo del pedido, listo para enviar a Fuegos.' },
  { emoji: '🎉', title: '¡A disfrutar!', text: 'Retirás en el local o pedís envío, dentro del horario de atención.' },
]

export default function HowToOrder() {
  const navigate = useNavigate()
  const { ref, revealed } = useScrollReveal<HTMLElement>()

  return (
    <section ref={ref} className={`section ${styles.section} ${revealed ? styles.revealed : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-eyebrow">Simple y rápido</span>
          <h2 className="section-title">
            ¿Cómo <span className="highlight">pedimos?</span>
          </h2>
          <p className="section-subtitle">Armá tu pedido en simples pasos y recibilo directo por WhatsApp.</p>
        </div>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <div key={step.title} className={styles.card}>
              <div className={styles.step}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <span className={styles.emoji}>{step.emoji}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>

        <div className={styles.cta}>
          <MagnetWrap>
            <Button onClick={() => navigate('/menu')}>Ir al menú →</Button>
          </MagnetWrap>
        </div>
      </div>
    </section>
  )
}
