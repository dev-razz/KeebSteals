"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Deal } from "@/lib/types"

interface DealsContextType {
  allDeals: Deal[]
  setAllDeals: (deals: Deal[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  lastFetchTime: number | null
  setLastFetchTime: (time: number | null) => void
}

const DealsContext = createContext<DealsContextType | undefined>(undefined)

export function DealsProvider({ children, initialDeals = [] }: { children: ReactNode; initialDeals?: Deal[] }) {
  const [allDeals, setAllDeals] = useState<Deal[]>(initialDeals)
  const [isLoading, setIsLoading] = useState(false)
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(initialDeals.length > 0 ? Date.now() : null)

  return (
    <DealsContext.Provider
      value={{
        allDeals,
        setAllDeals,
        isLoading,
        setIsLoading,
        lastFetchTime,
        setLastFetchTime,
      }}
    >
      {children}
    </DealsContext.Provider>
  )
}

export function useDeals() {
  const context = useContext(DealsContext)
  if (context === undefined) {
    throw new Error("useDeals must be used within a DealsProvider")
  }
  return context
}
