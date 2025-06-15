import { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiRefreshCw, FiSave, FiShoppingBag, FiRotateCw, FiZoomIn, FiZoomOut, FiHeart } from 'react-icons/fi'
import { useScan } from '../hooks/useScan'
import { useSuggestions } from '../hooks/useSuggestions'
import { useUserStore } from '../store/userStore'
import { useFavorites } from '../hooks/useFavorites'
import { useCartStore } from '../store/cartStore'
import { Link } from 'react-router-dom'
import LoadingSpinner from '../components/animations/LoadingSpinner'
import Scene from '../three/Scene'

// Import Avatar and ClothingModel components
import Avatar from '../three/Avatar'
import ClothingModel from '../three/ClothingModel'

const TryOnPage = () => {
  const [selectedClothing, setSelectedClothing] = useState(null)
  const [activeTab, setActiveTab] = useState('suggested')
  const [viewMode, setViewMode] = useState('front')
  const [scanStage, setScanStage] = useState('initial')
  const { startScan, scanProgress, avatarReady } = useScan()
  const { suggestions, recentlyViewed, trending, loading: suggestionsLoading } = useSuggestions()
  const { addToFavorites, isFavorite } = useFavorites()
  const user = useUserStore((state) => state.user)
  const avatarData = useUserStore((state) => state.avatarData)
  const addToCart = useCartStore((state) => state.addItem)
  
  // Check if user has avatar data
  useEffect(() => {
    if (avatarData) {
      setScanStage('complete')
    }
  }, [avatarData])
  
  const handleStartScan = async () => {
    setScanStage('scanning')
    await startScan()
    setScanStage('complete')
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }
  
  const handleAddToCart = () => {
    if (selectedClothing) {
      addToCart(selectedClothing)
    }
  }
  
  const handleToggleFavorite = () => {
    if (selectedClothing) {
      addToFavorites(selectedClothing)
    }
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
            <span className="gradient-text">Virtual Try-On</span> Experience
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Create your 3D model and try on clothes virtually before making a purchase.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar - Clothing options */}
          <div className="glassmorphism p-6 order-2 lg:order-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Select Clothing</h2>
              
              {/* Tabs */}
              <div className="flex space-x-2 text-sm">
                <TabButton 
                  active={activeTab === 'suggested'} 
                  onClick={() => setActiveTab('suggested')}
                  label="For You"
                />
                <TabButton 
                  active={activeTab === 'trending'} 
                  onClick={() => setActiveTab('trending')}
                  label="Trending"
                />
              </div>
            </div>
            
            {suggestionsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'suggested' ? (
                    <ClothingGrid 
                      key="suggested"
                      title="Recommended for You"
                      items={suggestions}
                      selectedClothing={selectedClothing}
                      onSelect={setSelectedClothing}
                    />
                  ) : (
                    <ClothingGrid 
                      key="trending"
                      title="Trending Now"
                      items={trending}
                      selectedClothing={selectedClothing}
                      onSelect={setSelectedClothing}
                    />
                  )}
                </AnimatePresence>
                
                {recentlyViewed.length > 0 && (
                  <ClothingGrid 
                    title="Recently Viewed"
                    items={recentlyViewed}
                    selectedClothing={selectedClothing}
                    onSelect={setSelectedClothing}
                  />
                )}
              </div>
            )}
          </div>
          
          {/* Center - 3D avatar display */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="glassmorphism p-6 h-[600px] relative">
              {scanStage === 'initial' ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <motion.div 
                    className="text-6xl mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 260,
                      damping: 20 
                    }}
                  >
                    👕
                  </motion.div>
                  <h2 className="text-2xl font-bold mb-4">Create Your 3D Model</h2>
                  <p className="text-text-secondary mb-8 text-center max-w-md">
                    Scan your face and body to create a personalized 3D model that lets you try on clothes virtually.
                  </p>
                  <button 
                    className="button-primary flex items-center space-x-2 group"
                    onClick={handleStartScan}
                  >
                    <FiUpload />
                    <span>Start Scanning</span>
                  </button>
                </div>
              ) : scanStage === 'scanning' ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <LoadingSpinner size={60} />
                  <div className="mt-8 w-64">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: '0%' }}
                        animate={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <p className="text-center mt-2 text-sm text-text-secondary">
                      Scanning... {scanProgress}%
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* View mode controls */}
                  <div className="absolute top-6 left-6 z-20 flex flex-col space-y-3 bg-background/60 backdrop-blur-sm p-2 rounded-lg">
                    <button 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        viewMode === 'front' ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                      } transition-colors`}
                      onClick={() => handleViewModeChange('front')}
                      aria-label="Front view"
                    >
                      <FiRotateCw />
                    </button>
                    <button 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        viewMode === 'side' ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                      } transition-colors`}
                      onClick={() => handleViewModeChange('side')}
                      aria-label="Side view"
                    >
                      <FiRotateCw className="transform rotate-90" />
                    </button>
                    <button 
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        viewMode === 'back' ? 'bg-primary' : 'bg-white/10 hover:bg-white/20'
                      } transition-colors`}
                      onClick={() => handleViewModeChange('back')}
                      aria-label="Back view"
                    >
                      <FiRotateCw className="transform rotate-180" />
                    </button>
                  </div>
                  
                  {/* Zoom controls */}
                  <div className="absolute top-6 right-6 z-20 flex space-x-3 bg-background/60 backdrop-blur-sm p-2 rounded-lg">
                    <button 
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Zoom in"
                    >
                      <FiZoomIn />
                    </button>
                    <button 
                      className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                      aria-label="Zoom out"
                    >
                      <FiZoomOut />
                    </button>
                  </div>
                  
                  {/* 3D Scene */}
                  <Scene>
                    <Suspense fallback={null}>
                      <Avatar viewMode={viewMode} />
                      {selectedClothing && <ClothingModel clothing={selectedClothing} />}
                    </Suspense>
                  </Scene>
                  
                  {/* Actions for selected clothing */}
                  {selectedClothing && (
                    <motion.div 
                      className="absolute bottom-6 inset-x-6 glassmorphism p-4 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div>
                        <h3 className="font-bold">{selectedClothing.name}</h3>
                        <p className="text-primary font-medium">${selectedClothing.price.toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={handleToggleFavorite}
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isFavorite(selectedClothing.id) 
                              ? 'bg-accent text-white' 
                              : 'bg-white/10 hover:bg-white/20'
                          } transition-colors`}
                          aria-label="Add to favorites"
                        >
                          <FiHeart fill={isFavorite(selectedClothing.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={handleAddToCart}
                          className="button-primary h-10 px-4 rounded-full flex items-center space-x-2"
                        >
                          <FiShoppingBag size={16} />
                          <span>Add to Cart</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </div>
            
            {/* Try-on info */}
            {scanStage === 'complete' && selectedClothing && (
              <div className="mt-6 p-4 glassmorphism">
                <h3 className="font-bold mb-2">Perfect Fit Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-text-secondary text-sm mb-1">Size Recommendation</p>
                    <p className="font-medium">{selectedClothing.recommendedSize || 'Medium'}</p>
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
          </div>
        </div>
      </div>
    </div>
  )
}

// Tab Button Component
const TabButton = ({ active, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full transition-colors ${
        active 
          ? 'bg-primary text-white' 
          : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  )
}

// Clothing Grid Component
const ClothingGrid = ({ title, items, selectedClothing, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-md font-medium mb-3 text-primary">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 6).map((item) => (
          <ClothingItem 
            key={item.id}
            item={item}
            isSelected={selectedClothing?.id === item.id}
            onSelect={() => onSelect(item)}
          />
        ))}
      </div>
    </motion.div>
  )
}

// Clothing Item Component
const ClothingItem = ({ item, isSelected, onSelect }) => {
  return (
    <motion.div 
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary' : 'hover:scale-105'
      }`}
      onClick={onSelect}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <img 
        src={item.thumbnail} 
        alt={item.name}
        className="w-full aspect-square object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <p className="text-xs font-medium line-clamp-1">{item.name}</p>
        <p className="text-xs text-gray-300">${item.price.toFixed(2)}</p>
      </div>
      {item.isNew && (
        <div className="absolute top-2 left-2 bg-accent text-xs font-bold py-1 px-2 rounded-full">
          New
        </div>
      )}
    </motion.div>
  )
}

export default TryOnPage