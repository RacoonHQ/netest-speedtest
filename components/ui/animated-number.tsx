"use client"

import { useEffect, useState } from "react"
import type { AnimatedNumberProps } from "@/types/speed-test.types"

// Default animation values in case constants are not available
const DEFAULT_ANIMATION = {
  duration: 1000, // 1 second
  updateInterval: 50 // 50ms
}

export function AnimatedNumber({
  value,
  label,
  unit,
  color,
  isAnimating = false,
  duration = 1000,
  updateInterval = 50
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0)
  
  // Safely get animation config with fallbacks
  const getAnimationConfig = () => {
    try {
      const config = require("@/constants/speed-test.constants")
      return {
        duration: config.animation?.duration || duration,
        updateInterval: config.animation?.updateInterval || updateInterval
      }
    } catch (e) {
      return {
        duration,
        updateInterval
      }
    }
  }
  
  const animation = getAnimationConfig()

  useEffect(() => {
    if (isAnimating) {
      // Real-time fluctuation during testing
      const interval = setInterval(() => {
        setDisplayValue(prev => {
          const randomFactor = 0.2
          const randomOffset = (Math.random() - 0.5) * (value * randomFactor)
          return value + randomOffset
        })
      }, animation.updateInterval)
      return () => clearInterval(interval)
    } else {
      // Smooth animation to final value
      const startTime = Date.now()
      const startValue = displayValue

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / animation.duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        
        setDisplayValue(startValue + (value - startValue) * easeOut)
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      const animationFrame = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationFrame)
    }
  }, [value, isAnimating, displayValue, animation])

  return (
    <div className="flex-1">
      <div className="text-3xl font-bold mb-1">
        <span className={color}>
          {Math.round(displayValue)}
        </span>
        <span className="text-sm text-muted-foreground ml-1">{unit}</span>
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}
