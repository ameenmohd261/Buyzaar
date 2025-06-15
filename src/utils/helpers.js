/**
 * Delay execution for a specific amount of time
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after the delay
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Generate a unique ID
 * @returns {string} - A unique string ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase()
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Get browser viewport dimensions
 * @returns {object} - Width and height of viewport
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  }
}

/**
 * Determine if device is mobile based on screen width
 * @returns {boolean} - True if mobile device
 */
export const isMobileDevice = () => {
  return window.innerWidth <= 768
}

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Get a random item from an array
 * @param {Array} array - Source array
 * @returns {*} - Random item
 */
export const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

/**
 * Create a debounced function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Calculate size recommendation based on measurements
 * @param {object} productSizing - Product sizing data
 * @param {object} userMeasurements - User's body measurements
 * @returns {string} - Recommended size
 */
export const calculateSizeRecommendation = (productSizing, userMeasurements) => {
  // This would be a more complex algorithm in a real application
  // For now, we'll return a mock recommendation
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  
  // Use chest measurement as primary factor (simplified)
  const chestSize = userMeasurements?.chest || 95
  
  if (chestSize < 88) return 'XS'
  if (chestSize < 94) return 'S'
  if (chestSize < 100) return 'M'
  if (chestSize < 106) return 'L'
  if (chestSize < 112) return 'XL'
  return 'XXL'
}