// app/page.tsx
import Hero from '@/components/hero'
import Layout from '@/components/layout'
import About from '@/components/about'
import FAQs from '@/components/faq'

export default function Home() {
  return (
    <Layout>
        <Hero />
        <About />
        <FAQs />
    </Layout>
  )
}
