import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiRefreshCw, FiThumbsUp, FiThumbsDown, FiShoppingBag, FiImage, FiPlusCircle, FiFilter, FiHeart } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'
import { useSuggestions } from '../hooks/useSuggestions'
import { useFavorites } from '../hooks/useFavorites'
import { useCartStore } from '../store/cartStore'
import LoadingSpinner from '../components/animations/LoadingSpinner'

const StyleAssistantPage = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('outfits')
  const [selectedOccasion, setSelectedOccasion] = useState('casual')
  const [uploadedImage, setUploadedImage] = useState(null)
  const navigate = useNavigate()
  
  const user = useUserStore((state) => state.user)
  const avatarData = useUserStore((state) => state.avatarData)
  const preferences = useUserStore((state) => state.preferences)
  const { addToFavorites, isFavorite } = useFavorites()
  const addToCart = useCartStore((state) => state.addItem)
  
  const { getOutfitSuggestions, getStyleRecommendations, loading: suggestionsLoading } = useSuggestions()
  
  const [outfits, setOutfits] = useState([])
  const [recommendations, setRecommendations] = useState([])
  
  useEffect(() => {
    // Simulate loading data
    const loadData = async () => {
      setLoading(true)
      
      // Fetch data based on user preferences and avatar data
      setTimeout(() => {
        // Mock data
        setOutfits(getOutfitSuggestions(selectedOccasion))
        setRecommendations(getStyleRecommendations())
        setLoading(false)
      }, 1500)
    }
    
    loadData()
  }, [selectedOccasion])
  
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        setUploadedImage(event.target.result)
      }
      
      reader.readAsDataURL(e.target.files[0])
    }
  }
  
  const handleAddToCart = (item) => {
    addToCart(item)
  }
  
  const handleToggleFavorite = (item) => {
    addToFavorites(item)
  }
  
  const handleRefreshRecommendations = () => {
    setLoading(true)
    
    // Simulate refreshing data
    setTimeout(() => {
      setOutfits(getOutfitSuggestions(selectedOccasion))
      setRecommendations(getStyleRecommendations())
      setLoading(false)
    }, 1000)
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Your Personal <span className="gradient-text">Style Assistant</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Get AI-powered fashion recommendations tailored specifically to you.
          </p>
        </motion.div>
        
        {!avatarData ? (
          <div className="max-w-xl mx-auto glassmorphism p-8 text-center">
            <div className="text-6xl mb-6">👗</div>
            <h2 className="text-2xl font-bold mb-4">Create Your Style Profile</h2>
            <p className="text-text-secondary mb-8">
              To get personalized style recommendations, we need to create your 3D model first.
            </p>
            <button 
              onClick={() => navigate('/scan')}
              className="button-primary"
            >
              Create Your 3D Model
            </button>
          </div>
        ) : (
          <>
            {/* Style preference picker */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Style Preferences</h2>
                <button 
                  onClick={handleRefreshRecommendations}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Refresh recommendations"
                >
                  <FiRefreshCw size={18} />
                </button>
              </div>
              
              {/* Tabs */}
              <div className="glassmorphism p-2 flex space-x-2 mb-6">
                <TabButton 
                  active={activeTab === 'outfits'} 
                  onClick={() => setActiveTab('outfits')}
                  label="Complete Outfits"
                />
                <TabButton 
                  active={activeTab === 'items'} 
                  onClick={() => setActiveTab('items')}
                  label="Individual Items"
                />
                <TabButton 
                  active={activeTab === 'upload'} 
                  onClick={() => setActiveTab('upload')}
                  label="Upload Inspiration"
                />
              </div>
              
              {/* Occasion filters */}
              {activeTab === 'outfits' && (
                <div className="flex flex-wrap gap-2 mb-6">
                  <OccasionButton 
                    active={selectedOccasion === 'casual'} 
                    onClick={() => setSelectedOccasion('casual')}
                    label="Casual"
                  />
                  <OccasionButton 
                    active={selectedOccasion === 'formal'} 
                    onClick={() => setSelectedOccasion('formal')}
                    label="Formal"
                  />
                  <OccasionButton 
                    active={selectedOccasion === 'business'} 
                    onClick={() => setSelectedOccasion('business')}
                    label="Business"
                  />
                  <OccasionButton 
                    active={selectedOccasion === 'party'} 
                    onClick={() => setSelectedOccasion('party')}
                    label="Party"
                  />
                  <OccasionButton 
                    active={selectedOccasion === 'vacation'} 
                    onClick={() => setSelectedOccasion('vacation')}
                    label="Vacation"
                  />
                </div>
              )}
            </div>
            
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-20"
                >
                  <LoadingSpinner size={60} />
                </motion.div>
              ) : activeTab === 'outfits' ? (
                <motion.div
                  key="outfits"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {outfits.map((outfit, index) => (
                      <OutfitCard 
                        key={outfit.id} 
                        outfit={outfit} 
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite}
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : activeTab === 'items' ? (
                <motion.div
                  key="items"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-medium">Recommended for Your Style</h2>
                      <button className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors">
                        <FiFilter size={16} />
                        <span className="text-sm">Filter</span>
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {recommendations.slice(0, 8).map((item, index) => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          onAddToCart={handleAddToCart}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={isFavorite}
                          delay={index * 0.05}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-medium mb-4">Based on Your Measurements</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {recommendations.slice(8, 16).map((item, index) => (
                        <ItemCard 
                          key={item.id} 
                          item={item} 
                          onAddToCart={handleAddToCart}
                          onToggleFavorite={handleToggleFavorite}
                          isFavorite={isFavorite}
                          delay={index * 0.05 + 0.4}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                  {/* Upload section */}
                  <div className="glassmorphism p-6">
                    <h3 className="text-xl font-bold mb-4">Upload Fashion Inspiration</h3>
                    <p className="text-text-secondary mb-6">
                      Upload an image of a style you like, and our AI will find similar items that suit your body type.
                    </p>
                    
                    <div className="mb-6">
                      <label 
                        className={`
                          border-2 border-dashed border-white/20 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer
                          ${uploadedImage ? 'p-0' : 'p-6'}
                          hover:border-primary/50 transition-colors
                        `}
                      >
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        
                        {uploadedImage ? (
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded fashion inspiration" 
                            className="w-full h-full object-cover rounded-lg" 
                          />
                        ) : (
                          <>
                            <FiImage size={48} className="text-text-secondary mb-4" />
                            <p className="text-text-secondary text-center">
                              Click to upload an image or drag and drop
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    
                    <button className="button-primary w-full">
                      Find Similar Styles
                    </button>
                  </div>
                  
                  {/* Suggested styles based on upload */}
                  <div className="md:col-span-2">
                    {uploadedImage ? (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Similar Items for You</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {recommendations.slice(0, 4).map((item) => (
                            <ItemCard 
                              key={item.id} 
                              item={item} 
                              onAddToCart={handleAddToCart}
                              onToggleFavorite={handleToggleFavorite}
                              isFavorite={isFavorite}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full glassmorphism p-8 flex flex-col items-center justify-center text-center">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-xl font-bold mb-2">Upload to Get Started</h3>
                        <p className="text-text-secondary">
                          Upload an image to see AI-powered style recommendations based on your inspiration and body type.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}

// Tab Button Component
const TabButton = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-lg transition-colors flex-1 ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

// Occasion Button Component
const OccasionButton = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  )
}

// Outfit Card Component
const OutfitCard = ({ outfit, onAddToCart, onToggleFavorite, isFavorite, delay }) => {
  return (
    <motion.div 
      className="glassmorphism overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="relative">
        <img 
          src={outfit.image} 
          alt={outfit.name}
          className="w-full aspect-[2/3] object-cover"
        />
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={() => onToggleFavorite(outfit)}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isFavorite(outfit.id) 
                ? 'bg-accent text-white' 
                : 'bg-black/40 backdrop-blur-sm hover:bg-black/60'
            } transition-colors`}
            aria-label="Add to favorites"
          >
            <FiHeart fill={isFavorite(outfit.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-lg mb-1">{outfit.name}</h3>
        <p className="text-text-secondary mb-4">Perfect for {outfit.occasion}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {outfit.items.slice(0, 3).map((item, index) => (
                <div 
                  key={index} 
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center overflow-hidden"
                >
                  <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {outfit.items.length > 3 && (
                <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-xs">
                  +{outfit.items.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-text-secondary">{outfit.items.length} items</span>
          </div>
          <div>
            <span className="font-bold">${outfit.totalPrice.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button 
            className="button-primary py-2 flex-grow flex items-center justify-center space-x-2"
            onClick={() => onAddToCart(outfit)}
          >
            <FiShoppingBag size={16} />
            <span>Add All to Cart</span>
          </button>
          <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
            <FiPlusCircle size={20} />
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <div className="flex items-center">
              <FiThumbsUp className="mr-1" /> 
              <span>{outfit.likes}</span>
            </div>
            <div className="flex items-center">
              <FiThumbsDown className="mr-1" /> 
              <span>{outfit.dislikes}</span>
            </div>
          </div>
          <div className="text-sm">
            <span className="text-text-secondary">Match Score: </span>
            <span className="text-success font-medium">{outfit.matchScore}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Item Card Component
const ItemCard = ({ item, onAddToCart, onToggleFavorite, isFavorite, delay = 0, compact = false }) => {
  return (
    <motion.div 
      className="glassmorphism overflow-hidden group card-hover"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="relative">
        <img 
          src={item.thumbnail} 
          alt={item.name}
          className="w-full aspect-square object-cover"
        />
        {!compact && (
          <div className={`
            absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 
            group-hover:opacity-100 transition-opacity duration-300
          `}>
            <div className="flex space-x-3">
              <button 
                onClick={() => onToggleFavorite(item)}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isFavorite(item.id) 
                    ? 'bg-accent text-white' 
                    : 'bg-white/20 hover:bg-white/40'
                } transition-colors`}
                aria-label="Add to favorites"
              >
                <FiHeart fill={isFavorite(item.id) ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={() => onAddToCart(item)}
                className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark transition-colors flex items-center justify-center"
                aria-label="Add to cart"
              >
                <FiShoppingBag size={16} />
              </button>
            </div>
          </div>
        )}
        {item.discount > 0 && (
          <div className="absolute top-2 left-2 bg-accent text-xs font-bold py-1 px-2 rounded-full">
            -{item.discount}%
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center">
            <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className="text-text-secondary line-through text-xs ml-2">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          {!compact && item.matchScore && (
            <div className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">
              {item.matchScore}% match
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default StyleAssistantPage