"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()


  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl" aria-label="KeyboardDeals Home">
            KeebSteals
            </Link>
          </div>
        </div>
      </div>

    </header>
  )
}
