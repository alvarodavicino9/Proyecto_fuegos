interface Props {
  size?: number
  className?: string
}

export default function CartIcon({ size = 22, className }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 4h2l2.2 11.2a2 2 0 002 1.6h7.6a2 2 0 002-1.6L21 8H6.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20.5" r="1.4" fill="currentColor" />
      <circle cx="17.5" cy="20.5" r="1.4" fill="currentColor" />
    </svg>
  )
}
