import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import type { CartLine, CartState, DeliveryMethod, NewCartLine, PaymentMethod } from '@/types/cart'

const STORAGE_KEY = 'fuegos-cart-v2'

function generateLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

type Action =
  | { type: 'ADD_LINE'; line: NewCartLine }
  | { type: 'INCREMENT'; lineId: string }
  | { type: 'DECREMENT'; lineId: string }
  | { type: 'REMOVE_LINE'; lineId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'SET_DELIVERY_METHOD'; value: DeliveryMethod }
  | { type: 'SET_PAYMENT_METHOD'; value: PaymentMethod }
  | { type: 'SET_ADDRESS'; value: string }
  | { type: 'SET_NOTES'; value: string }
  | { type: 'SET_CUSTOMER_NAME'; value: string }
  | { type: 'SET_CUSTOMER_PHONE'; value: string }

const initialState: CartState = {
  lines: [],
  isOpen: false,
  deliveryMethod: 'retiro',
  paymentMethod: 'efectivo',
  address: '',
  notes: '',
  customerName: '',
  customerPhone: '',
}

function loadInitialState(): CartState {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<CartState>
    return { ...initialState, ...parsed, isOpen: false }
  } catch {
    return initialState
  }
}

function reducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'ADD_LINE': {
      const line: CartLine = { ...action.line, lineId: generateLineId() }
      return { ...state, lines: [...state.lines, line], isOpen: true }
    }
    case 'INCREMENT': {
      const lines = state.lines.map((line) =>
        line.lineId === action.lineId ? { ...line, quantity: line.quantity + 1 } : line,
      )
      return { ...state, lines }
    }
    case 'DECREMENT': {
      const lines = state.lines
        .map((line) => (line.lineId === action.lineId ? { ...line, quantity: line.quantity - 1 } : line))
        .filter((line) => line.quantity > 0)
      return { ...state, lines }
    }
    case 'REMOVE_LINE': {
      return { ...state, lines: state.lines.filter((line) => line.lineId !== action.lineId) }
    }
    case 'CLEAR_CART':
      return { ...state, lines: [], notes: '', address: '' }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'SET_DELIVERY_METHOD':
      return { ...state, deliveryMethod: action.value }
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.value }
    case 'SET_ADDRESS':
      return { ...state, address: action.value }
    case 'SET_NOTES':
      return { ...state, notes: action.value }
    case 'SET_CUSTOMER_NAME':
      return { ...state, customerName: action.value }
    case 'SET_CUSTOMER_PHONE':
      return { ...state, customerPhone: action.value }
    default:
      return state
  }
}

interface CartContextValue {
  state: CartState
  totalItems: number
  totalPrice: number
  addLine: (line: NewCartLine) => void
  increment: (lineId: string) => void
  decrement: (lineId: string) => void
  removeLine: (lineId: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setDeliveryMethod: (value: DeliveryMethod) => void
  setPaymentMethod: (value: PaymentMethod) => void
  setAddress: (value: string) => void
  setNotes: (value: string) => void
  setCustomerName: (value: string) => void
  setCustomerPhone: (value: string) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, loadInitialState())

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const totalItems = useMemo(() => state.lines.reduce((sum, line) => sum + line.quantity, 0), [state.lines])
  const totalPrice = useMemo(
    () => state.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
    [state.lines],
  )

  const value: CartContextValue = {
    state,
    totalItems,
    totalPrice,
    addLine: (line) => dispatch({ type: 'ADD_LINE', line }),
    increment: (lineId) => dispatch({ type: 'INCREMENT', lineId }),
    decrement: (lineId) => dispatch({ type: 'DECREMENT', lineId }),
    removeLine: (lineId) => dispatch({ type: 'REMOVE_LINE', lineId }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    setDeliveryMethod: (value) => dispatch({ type: 'SET_DELIVERY_METHOD', value }),
    setPaymentMethod: (value) => dispatch({ type: 'SET_PAYMENT_METHOD', value }),
    setAddress: (value) => dispatch({ type: 'SET_ADDRESS', value }),
    setNotes: (value) => dispatch({ type: 'SET_NOTES', value }),
    setCustomerName: (value) => dispatch({ type: 'SET_CUSTOMER_NAME', value }),
    setCustomerPhone: (value) => dispatch({ type: 'SET_CUSTOMER_PHONE', value }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
