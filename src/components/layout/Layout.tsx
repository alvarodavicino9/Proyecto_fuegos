import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import WhatsAppFloatButton from './WhatsAppFloatButton'
import CartDrawer from '../cart/CartDrawer'

export default function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
    </>
  )
}
