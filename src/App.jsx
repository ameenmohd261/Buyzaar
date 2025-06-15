import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, lazy, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/common/Layout'
import LoadingScreen from './components/animations/LoadingScreen'

// Lazy-loaded pages
const HomePage = lazy(() => import('./pages/HomePage'))
const TryOnPage = lazy(() => import('./pages/TryOnPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ErrorPage = lazy(() => import('./pages/ErrorPage'))
const ScanningPage = lazy(() => import('./pages/ScanningPage'))
const StyleAssistantPage = lazy(() => import('./pages/StyleAssistantPage'))

// Routes with animated transitions
const AnimatedRoutes = () => {
  const location = useLocation()
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/try-on" element={<TryOnPage />} />
        <Route path="/scan" element={<ScanningPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/style-assistant" element={<StyleAssistantPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingScreen />}>
            <AnimatedRoutes />
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App