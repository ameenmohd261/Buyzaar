import { useState, useCallback } from 'react'
import { useProductStore } from '../store/productStore'
import { debounce } from '../utils/helpers'

export const useProductSearch = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { searchProducts } = useProductStore()
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm || searchTerm.length < 2) {
        setResults([])
        setLoading(false)
        return
      }
      
      try {
        const searchResults = await searchProducts(searchTerm)
        setResults(searchResults)
      } catch (err) {
        setError(err.message || 'Error searching products')
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300),
    [searchProducts]
  )
  
  // Search handler
  const search = useCallback((searchTerm) => {
    setQuery(searchTerm)
    setLoading(true)
    setError(null)
    debouncedSearch(searchTerm)
  }, [debouncedSearch])
  
  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('')
    setResults([])
    setError(null)
  }, [])
  
  return {
    query,
    results,
    loading,
    error,
    search,
    clearSearch
  }
}