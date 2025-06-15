import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi'

const ProductCard = ({ product, viewMode = 'grid', onAddToCart, onToggleFavorite, isFavorite }) => {
  if (viewMode === 'list') {
    return <ListViewProductCard 
      product={product}
      onAddToCart={onAddToCart}
      onToggleFavorite={onToggleFavorite}
      isFavorite={isFavorite}
    />
  }
  
  return (
    <motion.div className="group glassmorphism overflow-hidden card-hover">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden">
            <img 
              src={product.thumbnail} 
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          {/* Quick action buttons */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleFavorite()
                }}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isFavorite ? 'bg-accent text-white' : 'bg-white/20 hover:bg-white/40'}
                  transition-colors
                `}
                aria-label="Add to favorites"
              >
                <FiHeart fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onAddToCart()
                }}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
                aria-label="Add to cart"
              >
                <FiShoppingBag />
              </button>
              <Link
                to={`/product/${product.id}`}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 transition-colors flex items-center justify-center"
                aria-label="View details"
              >
                <FiEye />
              </Link>
            </div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col space-y-2">
            {product.isNew && (
              <span className="px-2 py-1 bg-accent text-xs font-bold rounded-full text-white">
                NEW
              </span>
            )}
            {product.discount > 0 && (
              <span className="px-2 py-1 bg-success text-xs font-bold rounded-full text-white">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-text-secondary text-sm mb-2">{product.brand}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-text-secondary line-through text-sm">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
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

const ListViewProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
  return (
    <motion.div className="glassmorphism overflow-hidden group">
      <div className="flex">
        <Link to={`/product/${product.id}`} className="w-40 h-40 flex-shrink-0 relative overflow-hidden">
          <img 
            src={product.thumbnail} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isNew && (
              <span className="px-2 py-0.5 bg-accent text-xs font-bold rounded-full text-white">
                NEW
              </span>
            )}
            {product.discount > 0 && (
              <span className="px-2 py-0.5 bg-success text-xs font-bold rounded-full text-white">
                -{product.discount}%
              </span>
            )}
          </div>
        </Link>
        
        <div className="flex-1 p-4 flex flex-col">
          <div>
            <div className="flex justify-between">
              <h3 className="font-medium mb-1">{product.name}</h3>
              
              <div className="flex space-x-1">
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
            
            <p className="text-text-secondary text-sm mb-2">{product.brand}</p>
          </div>
          
          <p className="text-text-secondary text-sm line-clamp-2 flex-grow mb-4">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              <span className="font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-text-secondary line-through text-sm">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={onToggleFavorite}
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  ${isFavorite ? 'bg-accent text-white' : 'bg-white/10 hover:bg-white/20'}
                  transition-colors
                `}
                aria-label="Add to favorites"
              >
                <FiHeart fill={isFavorite ? 'currentColor' : 'none'} size={16} />
              </button>
              <button
                onClick={onAddToCart}
                className="button-primary h-9 px-3 rounded-full flex items-center space-x-1"
              >
                <FiShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard