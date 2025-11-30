"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { useCallback, useEffect, useRef } from "react"
import { flushSync } from "react-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const isDark = theme === "dark"

  useEffect(() => {
    setMounted(true)
  }, [])

  const animateThemeChange = useCallback(
    async (newTheme: string) => {
      if (!buttonRef.current || typeof document.startViewTransition === "undefined") {
        setTheme(newTheme)
        return
      }

      await document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme)
        })
      }).ready

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const maxRadius = Math.hypot(
        Math.max(left, window.innerWidth - left),
        Math.max(top, window.innerHeight - top)
      )

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    },
    [setTheme]
  )

  const handleThemeChange = useCallback(
    (newTheme: string) => {
      animateThemeChange(newTheme)
    },
    [animateThemeChange]
  )

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          size="icon"
          className="relative overflow-hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="sun"
                initial={{ scale: 0, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 90, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.3,
                }}
                className="absolute"
              >
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ scale: 0, rotate: 90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: -90, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.3,
                }}
                className="absolute"
              >
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              </motion.div>
            )}
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
