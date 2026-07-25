interface Props {
  size?: number
  className?: string
}

export default function ShareIcon({ size = 18, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="5.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="18.5" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.2 10.8L14.8 6.8M8.2 13.2l6.6 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
