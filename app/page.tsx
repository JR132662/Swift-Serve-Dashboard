// app/page.tsx
import Hero from '@/components/hero'
import Layout from '@/components/layout'
import About from '@/components/about'
import FAQs from '@/components/faq'
import SwiftServeSteps from '@/components/swiftserve-steps'
import SwiftServeFeatures from '@/components/swiftserve-features'

export default function Home() {
  return (
    <Layout>
      <div className="force-light-mode">
        <Hero />
        <About />
        <SwiftServeSteps />
        <SwiftServeFeatures />
        <FAQs />
      </div>
    </Layout>
  )
}
