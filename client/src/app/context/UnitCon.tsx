'use client'

import {
  createContext,
  useContext,
  useState,
  ReactNode
} from 'react'

type Unit = 'metric' | 'imperial'

interface UnitContextValue {
  unit: Unit
  toggleUnit: () => void
}

const UnitContext = createContext<UnitContextValue | undefined>(undefined)

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnit] = useState<Unit>('metric')
  const toggleUnit = () =>
    setUnit((u) => (u === 'metric' ? 'imperial' : 'metric'))

  return (
    <UnitContext.Provider value={{ unit, toggleUnit }}>
      {children}
    </UnitContext.Provider>
  )
}

// custom hook for easy consumption
export function useUnit() {
  const ctx = useContext(UnitContext)
  if (!ctx) {
    throw new Error('useUnit must be used within a UnitProvider')
  }
  return ctx
}
