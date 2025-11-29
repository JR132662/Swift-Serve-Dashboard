"use client"

import React from "react"
import { motion } from "framer-motion"

type TextEffectProps = {
  as?: keyof React.JSX.IntrinsicElements
  preset?: string
  per?: "line" | "word" | "char"
  speedSegment?: number
  delay?: number
  className?: string
  children?: React.ReactNode
}

export function TextEffect({ as = "div", preset = "fade-in-blur", delay = 0, className, children }: TextEffectProps) {
  const MotionTag: any = (motion as any)[as] || motion.div

  const variants = {
    hidden: { opacity: 0, filter: "blur(10px)", y: 12 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  }

  return (
    <MotionTag
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

export default TextEffect
