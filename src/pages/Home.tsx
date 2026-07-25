import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppFloatButton from '@/components/layout/WhatsAppFloatButton'
import CartDrawer from '@/components/cart/CartDrawer'
import Hero from '@/sections/Hero'
import InfoStrip from '@/sections/InfoStrip'
import MenuSection from '@/sections/MenuSection'
import HowToOrder from '@/sections/HowToOrder'
import Story from '@/sections/Story'
import Location from '@/sections/Location'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <InfoStrip />
        <MenuSection />
        <HowToOrder />
        <Story />
        <Location />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
    </>
  )
}
