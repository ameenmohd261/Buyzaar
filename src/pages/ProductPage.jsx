import { useState, useEffect, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingBag, FiHeart, FiShare, FiArrowLeft, FiArrowRight, FiChevronDown } from 'react-icons/fi'
import { useProductStore } from '../store/productStore'
import { useUserStore } from '../store/userStore'
import { useCartStore } from '../store/cartStore'
import { useFavorites } from '../hooks/useFavorites'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import LoadingSpinner from '../components/animations/LoadingSpinner'
import ClothingModel from '../three/ClothingModel'
import SimilarProducts from '../components/product/SimilarProducts'

const ProductPage = () => {
  const { id } = useParams()
  const { getProduct, getSimilarProducts } = useProductStore()
  const user = useUserStore((state) => state.user)
  const avatarData = useUserStore((state) => state.avatarData)
  const addToCart = useCartStore((state) => state.addItem)
  const { addToFavorites, isFavorite } = useFavorites()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [similarProducts, setSimilarProducts] = useState([])
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [view3D, setView3D] = useState(false)
  const [showDetails, setShowDetails] = useState(true)
  const [showSizing, setShowSizing] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        // In a real app, this would be an API call
        const productData = await getProduct(id)
        setProduct(productData)
        setSelectedColor(productData.colors[0])
        setSelectedSize(productData.sizes[2]) // Default to medium
        
        // Get similar products
        const similar = await getSimilarProducts(productData.category, productData.id)
        setSimilarProducts(similar)
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])
  
  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart({
        ...product,
        selectedSize,
        selectedColor,
        quantity: 1
      })
    }
  }
  
  const handleToggleFavorite = () => {
    if (product) {
      addToFavorites(product)
    }
  }
  
  const toggleSection = (section) => {
    if (section === 'details') {
      setShowDetails(!showDetails)
    } else if (section === 'sizing') {
      setShowSizing(!showSizing)
    } else if (section === 'reviews') {
      setShowReviews(!showReviews)
    }
  }
  
  if (loading || !product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-10">
        {/* Product Detail View */}
        <div className="mb-8">
          <Link to="/category/all" className="inline-flex items-center text-text-secondary hover:text-primary mb-6">
            <FiArrowLeft className="mr-2" />
            <span>Back to Shopping</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              {/* Main Image/3D View */}
              <div className="glassmorphism overflow-hidden rounded-xl mb-4 aspect-square relative">
                <AnimatePresence mode="wait">
                  {view3D ? (
                    <motion.div
                      key="3d-view"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Canvas camera={{ position: [0, 0, 2.5], fov: 50 }}>
                        <ambientLight intensity={0.8} />
                        <directionalLight position={[10, 10, 10]} intensity={1} />
                        <Suspense fallback={null}>
                          <ClothingModel 
                            clothing={product} 
                            color={selectedColor.hex}
                          />
                        </Suspense>
                        <OrbitControls 
                          enableZoom={true}
                          minDistance={1.5}
                          maxDistance={4}
                        />
                      </Canvas>
                    </motion.div>
                  ) : (
                    <motion.img 
                      key="product-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      src={product.images[selectedImage]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
                
                {/* Image navigation */}
                {!view3D && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      aria-label="Previous image"
                    >
                      <FiArrowLeft />
                    </button>
                    <button 
                      onClick={() => setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                      aria-label="Next image"
                    >
                      <FiArrowRight />
                    </button>
                  </>
                )}
                
                {/* View toggle */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <button 
                    onClick={() => setView3D(!view3D)}
                    className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-sm text-white text-sm font-medium hover:bg-black/60 transition-colors"
                  >
                    {view3D ? 'View Photos' : 'View in 3D'}
                  </button>
                </div>
              </div>
              
              {/* Thumbnail images */}
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((image, index) => (
                  <button 
                    key={index} 
                    onClick={() => {
                      setSelectedImage(index)
                      setView3D(false)
                    }}
                    className={`
                      rounded-lg overflow-hidden border-2 transition-all
                      ${selectedImage === index && !view3D ? 'border-primary' : 'border-transparent hover:border-white/30'}
                    `}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
                <button 
                  onClick={() => setView3D(true)}
                  className={`
                    rounded-lg overflow-hidden border-2 transition-all bg-white/5
                    ${view3D ? 'border-primary' : 'border-transparent hover:border-white/30'}
                  `}
                >
                  <div className="w-full aspect-square flex items-center justify-center text-2xl">
                    3D
                  </div>
                </button>
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              {/* Brand & Title */}
              <div className="mb-4">
                <h4 className="text-text-secondary font-medium">{product.brand}</h4>
                <h1 className="text-3xl font-bold">{product.name}</h1>
              </div>
              
              {/* Price */}
              <div className="mb-6 flex items-center space-x-3">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-text-secondary line-through">${product.originalPrice.toFixed(2)}</span>
                )}
                {product.discount > 0 && (
                  <span className="px-2 py-1 bg-accent text-white text-sm font-bold rounded-full">
                    Save {product.discount}%
                  </span>
                )}
              </div>
              
              {/* Rating */}
              <div className="mb-6 flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-text-secondary">{product.rating.toFixed(1)} ({product.reviews.length} reviews)</span>
              </div>
              
              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color: {selectedColor?.name}</h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-10 h-10 rounded-full transition-all
                        ${selectedColor?.name === color.name ? 'ring-2 ring-offset-2 ring-primary ring-offset-background' : ''}
                      `}
                      style={{ backgroundColor: color.hex }}
                      aria-label={`Color: ${color.name}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Size: {selectedSize}</h3>
                  <button className="text-primary text-sm">Size Guide</button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        py-3 rounded-lg transition-all
                        ${selectedSize === size 
                          ? 'bg-primary text-white' 
                          : 'bg-white/5 hover:bg-white/10'
                        }
                        ${product.availableSizes.includes(size) ? '' : 'opacity-50 cursor-not-allowed'}
                      `}
                      disabled={!product.availableSizes.includes(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Perfect Fit Analysis */}
              {avatarData && (
                <div className="mb-6 glassmorphism p-4">
                  <h3 className="font-bold mb-2 flex items-center">
                    <span className="text-primary mr-2">✓</span> Perfect Fit Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Recommended Size</p>
                      <p className="font-medium">{selectedSize}</p>
                    </div>
                    <div>
                      <p className="text-text-secondary text-sm mb-1">Fit Assessment</p>
                      <div className="flex items-center">
                        <span className="h-2 w-16 bg-gradient-to-r from-error via-warning to-success rounded-full mr-2"></span>
                        <span className="font-medium text-success">Perfect fit</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="button-primary py-3 flex-grow flex items-center justify-center space-x-2"
                  disabled={!selectedSize || !selectedColor}
                >
                  <FiShoppingBag size={18} />
                  <span>Add to Cart</span>
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`
                    py-3 px-5 rounded-lg flex items-center justify-center
                    ${isFavorite(product.id) 
                      ? 'bg-accent text-white' 
                      : 'bg-white/5 hover:bg-white/10'}
                  `}
                  aria-label="Add to favorites"
                >
                  <FiHeart fill={isFavorite(product.id) ? 'currentColor' : 'none'} size={18} />
                </button>
                
                <button
                  className="py-3 px-5 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                  aria-label="Share"
                >
                  <FiShare size={18} />
                </button>
              </div>
              
              {/* Try On Button */}
              {product.has3dModel && (
                <div className="mb-8">
                  <Link
                    to={`/try-on?product=${product.id}`}
                    className="button-secondary w-full flex items-center justify-center space-x-2 py-3"
                  >
                    <span>Try it on your 3D model</span>
                    <FiArrowRight />
                  </Link>
                </div>
              )}
              
              {/* Product Details */}
              <div className="border-t border-white/10 space-y-3 divide-y divide-white/10">
                <DetailsSection
                  title="Product Details"
                  isOpen={showDetails}
                  toggle={() => toggleSection('details')}
                >
                  <div className="text-text-secondary space-y-4">
                    <p>{product.description}</p>
                    
                    <ul className="list-disc list-inside space-y-1">
                      {product.details.map((detail, index) => (
                        <li key={index}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </DetailsSection>
                
                <DetailsSection
                  title="Size & Fit"
                  isOpen={showSizing}
                  toggle={() => toggleSection('sizing')}
                >
                  <div className="text-text-secondary">
                    <p className="mb-4">{product.fitDescription}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Model's Measurements</h4>
                        <ul className="text-sm space-y-1">
                          <li>Height: 6'1" / 185 cm</li>
                          <li>Chest: 38" / 96 cm</li>
                          <li>Waist: 32" / 81 cm</li>
                          <li>Wearing size: Medium</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Materials</h4>
                        <ul className="text-sm space-y-1">
                          {product.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </DetailsSection>
                
                <DetailsSection
                  title="Reviews"
                  isOpen={showReviews}
                  toggle={() => toggleSection('reviews')}
                  count={product.reviews.length}
                >
                  <div className="space-y-4">
                    {product.reviews.slice(0, 3).map((review, index) => (
                      <div key={index} className="pb-4 border-b border-white/10">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-white/10 mr-2 overflow-hidden">
                              <img src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}`} alt={review.userName} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-medium">{review.userName}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-400'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-text-secondary mb-1">{review.comment}</p>
                        <p className="text-xs text-text-secondary">{review.date}</p>
                      </div>
                    ))}
                    
                    {product.reviews.length > 3 && (
                      <button className="text-primary text-sm font-medium">
                        Read all {product.reviews.length} reviews
                      </button>
                    )}
                  </div>
                </DetailsSection>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <SimilarProducts products={similarProducts} />
        </div>
      </div>
    </div>
  )
}

const DetailsSection = ({ title, isOpen, toggle, children, count }) => {
  return (
    <div className="py-4">
      <button 
        className="flex items-center justify-between w-full py-2" 
        onClick={toggle}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-bold">{title}</h3>
          {count && <span className="text-text-secondary">({count})</span>}
        </div>
        <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <FiChevronDown size={20} />
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductPage