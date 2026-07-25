interface Props {
  size?: number
  className?: string
}

// Ícono de llama recreado en SVG a partir del isotipo de marca, para no
// depender de un archivo de imagen hasta tener el original en alta calidad.
export default function FlameIcon({ size = 28, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 6c3 8-4 11-4 18 0 4 3 7 7 7 5 0 8-4 8-9 6 6 9 14 9 20 0 12-10 20-20 20S12 54 12 42c0-7 3-12 7-16 1 6 5 9 9 9 5 0 8-4 6-9-3-7-6-12-2-20Z"
        fill="url(#flame-gradient)"
      />
      <defs>
        <linearGradient id="flame-gradient" x1="12" y1="6" x2="46" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-flame-yellow)" />
          <stop offset="0.5" stopColor="var(--color-flame-orange)" />
          <stop offset="1" stopColor="var(--color-flame-red)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
