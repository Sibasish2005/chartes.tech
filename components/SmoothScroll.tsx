"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches

    // Initialize Lenis smooth scrolling with mobile optimizations
    const lenis = new Lenis({
      duration: isMobile ? 2.0 : 1.6, // slower, smoother animation duration on mobile
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential easing function
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: isMobile ? 0.7 : 0.9, // slower scroll speed on mobile
      touchMultiplier: isMobile ? 0.65 : 1.0, // slower touch swipe rate on mobile (reduced from 1.5)
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
