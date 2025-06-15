// Define all app routes in a single file for easy management
export const ROUTES = {
  HOME: '/',
  CATEGORY: '/category/:category',
  PRODUCT: '/product/:id',
  TRY_ON: '/try-on',
  SCAN: '/scan',
  STYLE_ASSISTANT: '/style-assistant',
  PROFILE: '/profile',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  ERROR: '*'
}

// Helper function to get route with params
export const getRoute = (route, params = {}) => {
  let path = route
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value)
  })
  return path
}

// Example usage: 
// getRoute(ROUTES.PRODUCT, { id: 'prod-123' }) => '/product/prod-123'