"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/motion-primitives/animated-group'
import { motion, AnimatePresence } from 'framer-motion'

interface CarouselImage {
  src: string
  alt: string
  theme?: string
}

interface ThemeCarouselProps {
  images?: CarouselImage[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const defaultImages: CarouselImage[] = [
  {
    src: '/Images/DashboardGreen.png',
    alt: 'SwiftServe Dashboard - Green Theme',
    theme: 'Default'
  },
  {
    src: '/Images/DashboardBlue.png',
    alt: 'SwiftServe Dashboard - Blue Theme',
    theme: 'Blue'
  },
  {
    src: '/Images/Dashboard.png',
    alt: 'SwiftServe Dashboard - Amber Theme',
    theme: 'Amber'
  }
]

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
}

export default function ThemeCarousel({ 
  images = defaultImages, 
  autoPlay = true,
  autoPlayInterval = 5000 
}: ThemeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || isHovered) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, isHovered, autoPlayInterval])

  return (
    <AnimatedGroup
      variants={{
        container: {
          visible: {
            transition: {
              staggerChildren: 0.05,
              delayChildren: 0.75,
            },
          },
        },
        ...transitionVariants,
      }}>
      <div 
        className="mask-b-from-85% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
          {/* Carousel Container */}
          <div className="relative aspect-15/8 overflow-hidden rounded-2xl bg-background">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  duration: 0.5
                }}
                className="absolute inset-0"
              >
                <Image
                  className="h-full w-full object-contain"
                  src={images[currentIndex].src}
                  alt={images[currentIndex].alt}
                  width={2700}
                  height={1440}
                  priority={currentIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background/90 transition-all z-10"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md hover:bg-background/90 transition-all z-10"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Theme Label (Optional) */}
            {images[currentIndex].theme && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-10"
              >
                <div className="bg-background/90 backdrop-blur-sm border rounded-full px-4 py-1.5 shadow-md">
                  <span className="text-sm font-medium text-foreground">
                    {images[currentIndex].theme} Theme
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-[#ba6908]'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedGroup>
  )
}

