import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { PRODUCTS } from '../data/products'

const AppContext = createContext(null)

const priceBounds = (() => {
  const prices = PRODUCTS.map(p => p.price)
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) }
})()

const initialState = {
  cart: [],
  filters: {
    query: '',
    minPrice: priceBounds.min,
    maxPrice: priceBounds.max,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, filters: { ...state.filters, query: action.payload } }
    case 'SET_MIN':
      return { ...state, filters: { ...state.filters, minPrice: action.payload } }
    case 'SET_MAX':
      return { ...state, filters: { ...state.filters, maxPrice: action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: { query: '', minPrice: priceBounds.min, maxPrice: priceBounds.max } }
    case 'ADD':
      {
        const found = state.cart.find(i => i.id === action.payload.id)
        const cart = found
          ? state.cart.map(i => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i)
          : [...state.cart, { ...action.payload, qty: 1 }]
        return { ...state, cart }
      }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter(i => i.id !== action.payload) }
    case 'INC':
      return { ...state, cart: state.cart.map(i => i.id === action.payload ? { ...i, qty: i.qty + 1 } : i) }
    case 'DEC':
      return { ...state, cart: state.cart.map(i => i.id === action.payload ? { ...i, qty: Math.max(1, i.qty - 1) } : i) }
    case 'CLEAR':
      return { ...state, cart: [] }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      const saved = JSON.parse(localStorage.getItem('easecart-state') || 'null')
      if (saved) return saved
    } catch {}
    return initialState
  })

  useEffect(() => {
    try {
      localStorage.setItem('easecart-state', JSON.stringify(state))
    } catch {}
  }, [state])

  const actions = useMemo(() => ({
    setQuery: (q) => dispatch({ type: 'SET_QUERY', payload: q }),
    setMinPrice: (v) => dispatch({ type: 'SET_MIN', payload: v }),
    setMaxPrice: (v) => dispatch({ type: 'SET_MAX', payload: v }),
    resetFilters: () => dispatch({ type: 'RESET_FILTERS' }),
    add: (p) => dispatch({ type: 'ADD', payload: p }),
    remove: (id) => dispatch({ type: 'REMOVE', payload: id }),
    inc: (id) => dispatch({ type: 'INC', payload: id }),
    dec: (id) => dispatch({ type: 'DEC', payload: id }),
    clear: () => dispatch({ type: 'CLEAR' }),
  }), [])

  const computed = useMemo(() => {
    const count = state.cart.reduce((s, i) => s + i.qty, 0)
    const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)
    const q = state.filters.query.trim().toLowerCase()
    const filtered = PRODUCTS.filter(p => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      const within = p.price >= state.filters.minPrice && p.price <= state.filters.maxPrice
      return matchesQ && within
    })
    return { count, subtotal, filtered, priceBounds }
  }, [state.cart, state.filters])

  const value = useMemo(() => ({
    state,
    ...actions,
    ...computed,
  }), [state, actions, computed])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
