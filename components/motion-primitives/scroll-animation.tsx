"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { ReactNode, Children } from "react"
import React from "react"

interface ScrollAnimationProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale"
  amount?: number
}

const directionVariants = {
  up: { hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -50 }, visible: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
}

export function ScrollAnimation({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const variants = directionVariants[direction]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  direction?: "up" | "down" | "left" | "right" | "fade" | "scale"
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.1,
  direction = "up",
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = directionVariants[direction]

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants} style={{ display: "contents" }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

