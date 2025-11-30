// app/page.tsx
import Hero from '@/components/hero'
import Layout from '@/components/layout'
import About from '@/components/about'
import FAQs from '@/components/faq'
import SwiftServeSteps from '@/components/swiftserve-steps'
import SwiftServeFeatures from '@/components/swiftserve-features'
import CarouselContainer from '@/components/caruousel-container'

export default function Home() {
  return (
    <Layout>
        <Hero />
        <About />
        <SwiftServeSteps />
        <SwiftServeFeatures />
        <CarouselContainer />
        <FAQs />
    </Layout>
  )
}
