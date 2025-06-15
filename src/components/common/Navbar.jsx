import { useState, useEffect } from 'react'
import { Link, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { FiSun, FiMoon, FiShoppingCart, FiUser, FiSearch, FiMenu, FiX } from 'react-icons/fi'
import { useCartStore } from '../../store/cartStore'
import { useUserStore } from '../../store/userStore'
import SearchDialog from './SearchDialog'
import '../../styles/Navbar.css'


const Navbar = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartItems = useCartStore((state) => state.items)
  const user = useUserStore((state) => state.user)
  
  // Track scrolling for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <>
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled ? 'glassmorphism' : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-50">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                <span className="font-sora font-bold text-white text-xl">B</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-40 -z-10 group-hover:opacity-60 transition duration-300"></div>
            </div>
            <span className="text-2xl font-sora font-bold gradient-text ml-2">Buyzaar</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationLink to="/" label="Home" currentPath={location.pathname} />
            <NavigationLink to="/category/all" label="Shop" currentPath={location.pathname} />
            <NavigationLink to="/try-on" label="Try On" currentPath={location.pathname} />
            <NavigationLink to="/style-assistant" label="Style AI" currentPath={location.pathname} />
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>
            
            <Link to="/cart" className="p-2 rounded-full hover:bg-white/10 transition-colors relative">
              <FiShoppingCart size={20} />
              {cartItems.length > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-accent rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  {cartItems.length}
                </motion.span>
              )}
            </Link>
            
            <div className="relative">
              {user ? (
                <Link to="/profile" className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary">
                  <img 
                    src={user.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : (
                <Link to="/profile" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                  <FiUser size={20} />
                </Link>
              )}
            </div>
            
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimateMobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      
      {/* Search Dialog */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

// NavigationLink component with active state
const NavigationLink = ({ to, label, currentPath }) => {
  const isActive = currentPath === to || 
    (to !== '/' && currentPath.startsWith(to));
  
  return (
    <NavLink 
      to={to} 
      className={`relative font-medium transition-colors ${
        isActive ? 'text-primary' : 'hover:text-primary'
      }`}
    >
      {label}
      {isActive && (
        <motion.div 
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
          layoutId="navbar-indicator"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      )}
    </NavLink>
  )
}

// Mobile Menu Animation
const AnimateMobileMenu = ({ isOpen, onClose }) => {
  const variants = {
    closed: {
      opacity: 0,
      y: "-100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      y: "0%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  };

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/category/all", label: "Shop" },
    { path: "/try-on", label: "Virtual Try On" },
    { path: "/style-assistant", label: "Style AI" },
    { path: "/profile", label: "My Profile" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          
          <motion.div 
            className="relative bg-background h-[70vh] glassmorphism mx-4 mt-20 rounded-xl p-8 flex flex-col"
          >
            <div className="space-y-6">
              {menuItems.map((item) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  className="border-b border-white/10 pb-4"
                >
                  <Link 
                    to={item.path}
                    className="text-xl font-medium hover:text-primary block transition-colors"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto">
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-text-secondary mb-4">Buyzaar - Try it. See it. Love it. Wear it.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Navbar