import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import { useUserStore } from '../../store/userStore'

const Layout = ({ children }) => {
  const location = useLocation()
  const user = useUserStore((state) => state.user)
  const checkAuthStatus = useUserStore((state) => state.checkAuthStatus)
  
  // Check auth status on initial load
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])
  
  // Determine if we should show the full layout or minimal layout
  const showMinimalLayout = ['/scan'].includes(location.pathname)
  
  return (
    <div className="flex flex-col min-h-screen">
      {!showMinimalLayout && <Navbar />}
      
      <main className={`flex-grow ${!showMinimalLayout ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {!showMinimalLayout && <Footer />}
    </div>
  )
}

export default Layout