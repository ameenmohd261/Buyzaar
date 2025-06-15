import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiSearch, FiX, FiArrowRight } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useProductSearch } from '../../hooks/useProductSearch'

const SearchDialog = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const { results, loading, search } = useProductSearch()
  
  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [isOpen])
  
  // Handle search input changes
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length >= 2) {
      search(value)
    }
  }
  
  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }
  
  const dialogVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Search Dialog */}
          <motion.div
            className="w-full max-w-3xl bg-background glassmorphism p-6 relative z-10"
            variants={dialogVariants}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Search Input */}
            <div className="relative">
              <FiSearch size={20} className="absolute left-4 top-3.5 text-text-secondary" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search for clothes, accessories..."
                className="input-field pl-12 pr-12 py-3 text-lg w-full"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-3.5 text-text-secondary hover:text-primary"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
            
            {/* Search Results */}
            <div className="mt-6 max-h-[60vh] overflow-y-auto pb-4">
              {loading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {query.length >= 2 && (
                    <div className="mb-6">
                      <p className="text-text-secondary text-sm mb-4">
                        {results.length} results for "{query}"
                      </p>
                      
                      {results.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {results.slice(0, 8).map((product) => (
                            <Link 
                              key={product.id}
                              to={`/product/${product.id}`}
                              className="group"
                              onClick={onClose}
                            >
                              <div className="rounded-lg overflow-hidden aspect-square mb-2">
                                <img 
                                  src={product.thumbnail} 
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                              <h4 className="text-sm font-medium group-hover:text-primary line-clamp-1">{product.name}</h4>
                              <p className="text-text-secondary text-sm">${product.price.toFixed(2)}</p>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10">
                          <p className="text-lg mb-2">No results found</p>
                          <p className="text-text-secondary text-sm mb-4">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Quick Links */}
                  {(!query || query.length < 2) && (
                    <div>
                      <h3 className="text-lg font-bold mb-4">Popular Searches</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <QuickSearchLink label="Summer Dresses" onClose={onClose} />
                        <QuickSearchLink label="Men's Shirts" onClose={onClose} />
                        <QuickSearchLink label="Sunglasses" onClose={onClose} />
                        <QuickSearchLink label="Casual Shoes" onClose={onClose} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const QuickSearchLink = ({ label, onClose }) => {
  return (
    <Link 
      to={`/search?q=${encodeURIComponent(label)}`}
      className="flex items-center justify-between glassmorphism p-4 hover:border-primary/30 transition-all duration-300"
      onClick={onClose}
    >
      <span>{label}</span>
      <FiArrowRight className="opacity-50 group-hover:opacity-100" />
    </Link>
  )
}

export default SearchDialog