import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag, FiHeart } from 'react-icons/fi'
import { useFavorites } from '../../hooks/useFavorites'
import { useCartStore } from '../../store/cartStore'

const SimilarProducts = ({ products }) => {
  const { addToFavorites, isFavorite } = useFavorites()
  const addToCart = useCartStore((state) => state.addItem)
  
  const handleAddToCart = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }
  
  const handleToggleFavorite = (e, product) => {
    e.preventDefault()
    e.stopPropagation()
    addToFavorites(product)
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          delay={index * 0.05}
        />
      ))}
    </div>
  )
}

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite, delay }) => {
  return (
    <motion.div 
      className="glassmorphism overflow-hidden group card-hover"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <img 
              src={product.thumbnail} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Quick action buttons */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
            <button
              onClick={(e) => onToggleFavorite(e, product)}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isFavorite(product.id) ? 'bg-accent text-white' : 'bg-white/20 hover:bg-white/40'}
                transition-colors
              `}
              aria-label="Add to favorites"
            >
              <FiHeart size={16} fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={(e) => onAddToCart(e, product)}
              className="w-8 h-8 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
              aria-label="Add to cart"
            >
              <FiShoppingBag size={16} />
            </button>
          </div>
        </div>
        
        <div className="p-3">
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="font-bold">${product.price.toFixed(2)}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3 h-3 ${i < product.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default SimilarProducts