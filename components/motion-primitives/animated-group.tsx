"use client"

import React from "react"
import { motion } from "framer-motion"

type AnimatedGroupProps = {
  children?: React.ReactNode
  className?: string
  variants?: any
}

export function AnimatedGroup({ children, className, variants }: AnimatedGroupProps) {
  const containerVariants = variants?.container ?? {
    visible: { transition: { staggerChildren: 0.06 } },
  }
  const itemVariant = variants?.item ?? {
    hidden: { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div key={i} variants={itemVariant} style={{ display: "contents" }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default AnimatedGroup
