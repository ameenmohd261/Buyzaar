// Base API URL - in a real app this would be your backend server
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.buyzaar.com/v1'
  : 'https://api-staging.buyzaar.com/v1'

// API Endpoints
export const API = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Product endpoints
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id}`,
    SEARCH: '/products/search',
    FEATURED: '/products/featured',
    CATEGORIES: '/products/categories',
    BY_CATEGORY: (category) => `/products/category/${category}`,
    RECOMMENDATIONS: '/products/recommendations',
  },
  
  // Cart endpoints
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    REMOVE: '/cart/remove',
    UPDATE: '/cart/update',
    CLEAR: '/cart/clear',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile/update',
    ADDRESSES: '/user/addresses',
    ADD_ADDRESS: '/user/addresses/add',
    UPDATE_ADDRESS: (id) => `/user/addresses/${id}`,
    PAYMENT_METHODS: '/user/payment-methods',
    ADD_PAYMENT_METHOD: '/user/payment-methods/add',
    UPDATE_PAYMENT_METHOD: (id) => `/user/payment-methods/${id}`,
    ORDERS: '/user/orders',
    ORDER_DETAIL: (id) => `/user/orders/${id}`,
    FAVORITES: '/user/favorites',
    TOGGLE_FAVORITE: '/user/favorites/toggle',
  },
  
  // Virtual try-on endpoints
  TRY_ON: {
    SCAN: '/try-on/scan',
    GET_MODEL: '/try-on/model',
    TRY_PRODUCT: (productId) => `/try-on/product/${productId}`,
  },
  
  // Style assistant endpoints
  STYLE: {
    GET_RECOMMENDATIONS: '/style/recommendations',
    GET_OUTFITS: '/style/outfits',
    ANALYZE_IMAGE: '/style/analyze-image',
    UPDATE_PREFERENCES: '/style/preferences',
  }
}

// Utility function to build full API URL
export const getApiUrl = (endpoint) => `${BASE_URL}${endpoint}`