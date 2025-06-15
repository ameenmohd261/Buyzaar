import { create } from 'zustand'

export const useProductStore = create((set, get) => ({
  products: [], // All products
  categories: [], // All categories
  loading: false,
  error: null,
  
  // Fetch all products (would normally be an API call)
  fetchProducts: async () => {
    set({ loading: true })
    try {
      // Mock data - in a real app, this would be an API call
      const mockProducts = generateMockProducts(100)
      const categories = [...new Set(mockProducts.map(product => product.category))]
      
      set({ 
        products: mockProducts,
        categories,
        loading: false
      })
      
      return mockProducts
    } catch (error) {
      set({ error, loading: false })
      throw error
    }
  },
  
  // Get a product by ID
  getProduct: async (id) => {
    let products = get().products
    
    // If products haven't been loaded yet, load them
    if (products.length === 0) {
      products = await get().fetchProducts()
    }
    
    return products.find(product => product.id === id) || null
  },
  
  // Get products by category
  getProductsByCategory: async (category) => {
    let products = get().products
    
    // If products haven't been loaded yet, load them
    if (products.length === 0) {
      products = await get().fetchProducts()
    }
    
    return products.filter(product => product.category === category)
  },
  
  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    let products = get().products
    
    // If products haven't been loaded yet, load them
    if (products.length === 0) {
      products = await get().fetchProducts()
    }
    
    // Sort by rating and return top products
    return products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit)
  },
  
  // Get similar products based on category
  getSimilarProducts: async (category, excludeId, limit = 4) => {
    let products = get().products
    
    // If products haven't been loaded yet, load them
    if (products.length === 0) {
      products = await get().fetchProducts()
    }
    
    return products
      .filter(product => product.category === category && product.id !== excludeId)
      .slice(0, limit)
  },
  
  // Search products
  searchProducts: async (query) => {
    let products = get().products
    
    // If products haven't been loaded yet, load them
    if (products.length === 0) {
      products = await get().fetchProducts()
    }
    
    const searchTerm = query.toLowerCase()
    
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
  }
}))

// Helper function to generate mock products
function generateMockProducts(count) {
  const categories = ['shirts', 'pants', 'dresses', 'jackets', 'accessories']
  const brands = ['Stylewise', 'Urban Threads', 'Elegance', 'Apex', 'Zenith']
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Red', hex: '#ff0000' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000ff' }
  ]
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  
  return Array.from({ length: count }).map((_, i) => {
    const id = `prod-${i + 1}`
    const category = categories[Math.floor(Math.random() * categories.length)]
    const brand = brands[Math.floor(Math.random() * brands.length)]
    const name = `${brand} ${category.slice(0, -1).charAt(0).toUpperCase() + category.slice(0, -1).slice(1)} ${i + 1}`
    
    const price = Math.round((19.99 + Math.random() * 80) * 100) / 100
    const discount = Math.random() > 0.7 ? Math.floor(Math.random() * 3) * 10 : 0
    const originalPrice = discount > 0 ? Math.round((price / (1 - discount / 100)) * 100) / 100 : null
    
    const productColors = [...colors].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2)
    
    return {
      id,
      name,
      brand,
      category,
      description: `This premium ${category.slice(0, -1)} from ${brand} offers both style and comfort. Perfect for any occasion.`,
      price,
      discount,
      originalPrice,
      rating: Math.min(5, Math.max(3, 3 + Math.random() * 2)),
      reviews: Array.from({ length: Math.floor(Math.random() * 20) + 5 }).map((_, i) => ({
        userName: `User${i + 1}`,
        rating: Math.min(5, Math.max(1, Math.floor(Math.random() * 5) + 1)),
        comment: `Great ${category.slice(0, -1)}! I'm very satisfied with the quality and fit.`,
        date: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 28) + 1}/2024`
      })),
      colors: productColors,
      sizes,
      availableSizes: sizes.filter(() => Math.random() > 0.2),
      thumbnail: `/assets/products/${category}/${Math.floor(Math.random() * 5) + 1}.jpg`,
      images: Array.from({ length: 4 }).map((_, i) => 
        `/assets/products/${category}/${Math.floor(Math.random() * 5) + 1}.jpg`
      ),
      details: [
        'Premium quality material',
        'Comfortable fit',
        'Machine washable',
        'Imported'
      ],
      materials: [
        '95% Cotton',
        '5% Elastane'
      ],
      has3dModel: Math.random() > 0.4,
      isNew: Math.random() > 0.8,
      isFeatured: Math.random() > 0.7,
      stock: Math.floor(Math.random() * 50) + 1,
      fitDescription: 'This item fits true to size. We recommend ordering your normal size.'
    }
  })
}