"use client"

import { useEffect, useState } from "react"

/**
 * Hook to check if the component has been hydrated on the client
 * Useful for preventing hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely access window object
 * Returns undefined during SSR
 */
export function useWindow() {
  const [windowObj, setWindowObj] = useState<Window | undefined>(undefined)

  useEffect(() => {
    setWindowObj(window)
  }, [])

  return windowObj
}

/**
 * Hook for hydration-safe media queries
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return isClient ? matches : false
}
