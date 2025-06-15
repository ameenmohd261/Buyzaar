import { useState, useEffect, useCallback } from 'react'
import { useUserStore } from '../store/userStore'

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([])
  const user = useUserStore((state) => state.user)
  
  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('buyzaar-favorites')
    
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error)
        setFavorites([])
      }
    }
  }, [])
  
  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('buyzaar-favorites', JSON.stringify(favorites))
  }, [favorites])
  
  // Add or remove an item from favorites
  const addToFavorites = useCallback((item) => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some(fav => fav.id === item.id)
      
      if (exists) {
        // Remove from favorites
        return currentFavorites.filter(fav => fav.id !== item.id)
      } else {
        // Add to favorites
        return [...currentFavorites, item]
      }
    })
  }, [])
  
  // Check if an item is in favorites
  const isFavorite = useCallback((itemId) => {
    return favorites.some(fav => fav.id === itemId)
  }, [favorites])
  
  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])
  
  return {
    favorites,
    addToFavorites,
    isFavorite,
    clearFavorites
  }
}