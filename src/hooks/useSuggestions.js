import { useState, useEffect } from 'react'
import { useUserStore } from '../store/userStore'
import { useProductStore } from '../store/productStore'

export const useSuggestions = () => {
  const [suggestions, setSuggestions] = useState([])
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  
  const user = useUserStore((state) => state.user)
  const avatarData = useUserStore((state) => state.avatarData)
  const preferences = useUserStore((state) => state.preferences)
  const { products, fetchProducts } = useProductStore()
  
  // Load product data and generate suggestions
  useEffect(() => {
    const loadSuggestions = async () => {
      setLoading(true)
      try {
        // Ensure products are loaded
        let productsData = products
        if (productsData.length === 0) {
          productsData = await fetchProducts()
        }
        
        // Generate personalized suggestions
        // In a real app, this would be done by a backend AI service
        const personalizedSuggestions = generateSuggestions(productsData, avatarData, preferences)
        
        // Generate trending products
        const trendingProducts = productsData
          .sort(() => 0.5 - Math.random())
          .slice(0, 12)
        
        // Mock recently viewed products
        const recentProducts = productsData
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)
        
        setSuggestions(personalizedSuggestions)
        setTrending(trendingProducts)
        setRecentlyViewed(recentProducts)
      } catch (error) {
        console.error('Error loading suggestions:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSuggestions()
  }, [products, avatarData, preferences])
  
  // Generate outfit suggestions based on occasion
  const getOutfitSuggestions = (occasion) => {
    // In a real app, this would be a much more sophisticated AI algorithm
    // that considers user preferences, body type, etc.
    
    // Mock outfit generator
    const outfits = []
    
    for (let i = 0; i < 6; i++) {
      const items = suggestions
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2)
      
      const totalPrice = items.reduce((sum, item) => sum + item.price, 0)
      
      outfits.push({
        id: `outfit-${i + 1}`,
        name: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Outfit ${i + 1}`,
        image: `/assets/outfits/${occasion}-${(i % 3) + 1}.jpg`,
        items: items,
        totalPrice,
        occasion,
        likes: Math.floor(Math.random() * 100) + 20,
        dislikes: Math.floor(Math.random() * 10),
        matchScore: Math.floor(Math.random() * 20) + 80
      })
    }
    
    return outfits
  }
  
  // Generate style recommendations
  const getStyleRecommendations = () => {
    // Return a mix of suggestions and trending
    return [...suggestions, ...trending]
      .sort(() => 0.5 - Math.random())
      .slice(0, 20)
      .map(item => ({
        ...item,
        matchScore: Math.floor(Math.random() * 20) + 80
      }))
  }
  
  return {
    suggestions,
    recentlyViewed,
    trending,
    loading,
    getOutfitSuggestions,
    getStyleRecommendations
  }
}

// Helper function to generate personalized suggestions
function generateSuggestions(products, avatarData, preferences) {
  // This would normally be a sophisticated algorithm on the backend
  // For now, just return a random selection of products
  return products
    .sort(() => 0.5 - Math.random())
    .slice(0, 12)
}