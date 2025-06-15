import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="pt-20 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <div className="glassmorphism p-8 md:p-12 mb-16 relative overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-30 -z-10" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-20 -z-10" />
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <motion.h3 
                className="text-3xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Get <span className="gradient-text">Style Updates</span>
              </motion.h3>
              <motion.p 
                className="text-text-secondary mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Subscribe to our newsletter for personalized style tips, new arrivals, and exclusive offers.
              </motion.p>
            </div>
            <div>
              <motion.div 
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="input-field flex-grow"
                />
                <button className="button-primary h-12 aspect-square p-0 flex items-center justify-center">
                  <FiArrowRight size={20} />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Main Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Company */}
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-text-secondary hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-text-secondary hover:text-primary">Careers</Link></li>
              <li><Link to="/press" className="text-text-secondary hover:text-primary">Press</Link></li>
              <li><Link to="/sustainability" className="text-text-secondary hover:text-primary">Sustainability</Link></li>
            </ul>
          </div>
          
          {/* Shop */}
          <div>
            <h4 className="text-lg font-bold mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link to="/category/women" className="text-text-secondary hover:text-primary">Women</Link></li>
              <li><Link to="/category/men" className="text-text-secondary hover:text-primary">Men</Link></li>
              <li><Link to="/category/accessories" className="text-text-secondary hover:text-primary">Accessories</Link></li>
              <li><Link to="/new-arrivals" className="text-text-secondary hover:text-primary">New Arrivals</Link></li>
            </ul>
          </div>
          
          {/* Technology */}
          <div>
            <h4 className="text-lg font-bold mb-6">Technology</h4>
            <ul className="space-y-4">
              <li><Link to="/technology" className="text-text-secondary hover:text-primary">3D Scanning</Link></li>
              <li><Link to="/virtual-try-on" className="text-text-secondary hover:text-primary">Virtual Try-On</Link></li>
              <li><Link to="/style-ai" className="text-text-secondary hover:text-primary">Style AI</Link></li>
              <li><Link to="/privacy" className="text-text-secondary hover:text-primary">Data & Privacy</Link></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-text-secondary hover:text-primary">Help Center</Link></li>
              <li><Link to="/returns" className="text-text-secondary hover:text-primary">Returns & Exchanges</Link></li>
              <li><Link to="/shipping" className="text-text-secondary hover:text-primary">Shipping</Link></li>
              <li><Link to="/contact" className="text-text-secondary hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
              <span className="font-sora font-bold text-white text-sm">B</span>
            </div>
            <span className="text-xl font-sora font-bold gradient-text">Buyzaar</span>
          </Link>
          
          {/* Social Links */}
          <div className="flex space-x-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Instagram">
              <FiInstagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Twitter">
              <FiTwitter size={20} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Facebook">
              <FiFacebook size={20} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="YouTube">
              <FiYoutube size={20} />
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-text-secondary text-sm">
            © {currentYear} Buyzaar. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer