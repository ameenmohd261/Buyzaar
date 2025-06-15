import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX, FiChevronDown, FiGrid, FiList, FiSliders, FiCheck } from 'react-icons/fi'
import { useProductStore } from '../store/productStore'
import { useFavorites } from '../hooks/useFavorites'
import { useCartStore } from '../store/cartStore'
import LoadingSpinner from '../components/animations/LoadingSpinner'
import ProductCard from '../components/product/ProductCard'

const CategoryPage = () => {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getProductsByCategory, categories } = useProductStore()
  const { addToFavorites, isFavorite } = useFavorites()
  const addToCart = useCartStore((state) => state.addItem)
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedSizes, setSelectedSizes] = useState([])
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('newest')
  
  // Get brand, color, and size options from products
  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    colors: [],
    sizes: [],
    minPrice: 0,
    maxPrice: 1000
  })
  
  // Fetch products based on category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        let fetchedProducts
        
        if (category === 'all') {
          // Fetch all products
          fetchedProducts = await getProductsByCategory()
        } else {
          // Fetch by category
          fetchedProducts = await getProductsByCategory(category)
        }
        
        setProducts(fetchedProducts)
        
        // Extract filter options
        const brands = [...new Set(fetchedProducts.map(p => p.brand))]
        const sizes = [...new Set(fetchedProducts.flatMap(p => p.sizes))]
        const colors = [...new Set(fetchedProducts.flatMap(p => p.colors.map(c => c.name)))]
        const prices = fetchedProducts.map(p => p.price)
        const minPrice = Math.floor(Math.min(...prices))
        const maxPrice = Math.ceil(Math.max(...prices))
        
        setFilterOptions({
          brands,
          colors,
          sizes,
          minPrice,
          maxPrice
        })
        
        setPriceRange([minPrice, maxPrice])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [category])
  
  // Apply filters and sorting
  useEffect(() => {
    if (products.length === 0) return
    
    let result = [...products]
    
    // Apply filters
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }
    
    if (selectedColors.length > 0) {
      result = result.filter(p => 
        p.colors.some(c => selectedColors.includes(c.name))
      )
    }
    
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.availableSizes.some(s => selectedSizes.includes(s))
      )
    }
    
    result = result.filter(p => 
      p.price >= priceRange[0] && p.price <= priceRange[1]
    )
    
    // Apply sorting
    switch (sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price)
        break
      case 'popularity':
        result.sort((a, b) => b.reviews.length - a.reviews.length)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        // Assume newer items have higher IDs in our mock data
        result.sort((a, b) => parseInt(b.id.split('-')[1]) - parseInt(a.id.split('-')[1]))
    }
    
    setFilteredProducts(result)
  }, [products, selectedBrands, selectedColors, selectedSizes, priceRange, sortBy])
  
  const handleToggleFilter = () => {
    setFilterOpen(!filterOpen)
  }
  
  const handleAddToCart = (product) => {
    addToCart({
      ...product,
      selectedSize: product.availableSizes[0],
      selectedColor: product.colors[0],
      quantity: 1
    })
  }
  
  const handleToggleFavorite = (product) => {
    addToFavorites(product)
  }
  
  const handleToggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand))
    } else {
      setSelectedBrands([...selectedBrands, brand])
    }
  }
  
  const handleToggleColor = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
  }
  
  const handleToggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size))
    } else {
      setSelectedSizes([...selectedSizes, size])
    }
  }
  
  const handleResetFilters = () => {
    setSelectedBrands([])
    setSelectedColors([])
    setSelectedSizes([])
    setPriceRange([filterOptions.minPrice, filterOptions.maxPrice])
  }
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-10">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {category === 'all' 
              ? 'All Products' 
              : `${category.charAt(0).toUpperCase() + category.slice(1)}`}
          </h1>
          <p className="text-text-secondary">
            {filteredProducts.length} products found
          </p>
        </div>
        
        {/* Filters and Sorting */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleToggleFilter}
              className="flex items-center space-x-2 px-4 py-2 glassmorphism rounded-lg hover:bg-white/10 transition-colors"
            >
              <FiFilter size={16} />
              <span>Filters</span>
              {(selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0) && (
                <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs">
                  {selectedBrands.length + selectedColors.length + selectedSizes.length}
                </span>
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-2">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10'
                }`}
                aria-label="Grid view"
              >
                <FiGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-white/5 hover:bg-white/10'
                }`}
                aria-label="List view"
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
          
          {/* Sort Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-4 py-2 glassmorphism rounded-lg hover:bg-white/10 transition-colors">
              <FiSliders size={16} />
              <span>Sort By: {getSortLabel(sortBy)}</span>
              <FiChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 glassmorphism rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <SortOption 
                value="newest" 
                current={sortBy} 
                onClick={() => setSortBy('newest')}
                label="Newest First" 
              />
              <SortOption 
                value="price-low-high" 
                current={sortBy} 
                onClick={() => setSortBy('price-low-high')}
                label="Price: Low to High" 
              />
              <SortOption 
                value="price-high-low" 
                current={sortBy} 
                onClick={() => setSortBy('price-high-low')}
                label="Price: High to Low" 
              />
              <SortOption 
                value="popularity" 
                current={sortBy} 
                onClick={() => setSortBy('popularity')}
                label="Most Popular" 
              />
              <SortOption 
                value="rating" 
                current={sortBy} 
                onClick={() => setSortBy('rating')}
                label="Highest Rated" 
              />
            </div>
          </div>
        </div>
        
        {/* Mobile Filter Panel */}
        <div className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col md:hidden
          ${filterOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
          transition-all duration-300
        `}>
          <div className={`
            mt-auto bg-background glassmorphism rounded-t-2xl max-h-[90vh] overflow-y-auto
            ${filterOpen ? 'translate-y-0' : 'translate-y-full'}
            transition-transform duration-300
          `}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  onClick={handleToggleFilter}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <FilterSection title="Brand" count={selectedBrands.length}>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.brands.map(brand => (
                    <FilterCheckbox 
                      key={brand}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleToggleBrand(brand)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Color" count={selectedColors.length}>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.colors.map(color => (
                    <FilterColor 
                      key={color}
                      colorName={color}
                      selected={selectedColors.includes(color)}
                      onClick={() => handleToggleColor(color)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Size" count={selectedSizes.length}>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map(size => (
                    <FilterSize 
                      key={size}
                      size={size}
                      selected={selectedSizes.includes(size)}
                      onClick={() => handleToggleSize(size)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Price Range">
                <div className="px-2">
                  <div className="flex justify-between mb-4">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  
                  {/* This would be a proper range slider in a real app */}
                  <div className="h-1 bg-white/10 rounded-full relative">
                    <div 
                      className="absolute h-full bg-primary rounded-full"
                      style={{ 
                        left: `${((priceRange[0] - filterOptions.minPrice) / (filterOptions.maxPrice - filterOptions.minPrice)) * 100}%`,
                        right: `${100 - ((priceRange[1] - filterOptions.minPrice) / (filterOptions.maxPrice - filterOptions.minPrice)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </FilterSection>
              
              <div className="flex space-x-4 mt-8">
                <button 
                  onClick={handleResetFilters}
                  className="button-secondary flex-grow"
                >
                  Reset
                </button>
                <button 
                  onClick={handleToggleFilter}
                  className="button-primary flex-grow"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop View */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-60 flex-shrink-0">
            <div className="glassmorphism p-6 rounded-xl sticky top-28">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  onClick={handleResetFilters}
                  className="text-primary text-sm hover:underline"
                >
                  Reset
                </button>
              </div>
              
              <FilterSection title="Brand" count={selectedBrands.length}>
                <div className="space-y-2">
                  {filterOptions.brands.map(brand => (
                    <FilterCheckbox 
                      key={brand}
                      label={brand}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleToggleBrand(brand)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Color" count={selectedColors.length}>
                <div className="flex flex-wrap gap-3">
                  {filterOptions.colors.map(color => (
                    <FilterColor 
                      key={color}
                      colorName={color}
                      selected={selectedColors.includes(color)}
                      onClick={() => handleToggleColor(color)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Size" count={selectedSizes.length}>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.sizes.map(size => (
                    <FilterSize 
                      key={size}
                      size={size}
                      selected={selectedSizes.includes(size)}
                      onClick={() => handleToggleSize(size)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              <FilterSection title="Price Range">
                <div className="px-2">
                  <div className="flex justify-between mb-4">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  
                  {/* This would be a proper range slider in a real app */}
                  <div className="h-1 bg-white/10 rounded-full relative">
                    <div 
                      className="absolute h-full bg-primary rounded-full"
                      style={{ 
                        left: `${((priceRange[0] - filterOptions.minPrice) / (filterOptions.maxPrice - filterOptions.minPrice)) * 100}%`,
                        right: `${100 - ((priceRange[1] - filterOptions.minPrice) / (filterOptions.maxPrice - filterOptions.minPrice)) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </FilterSection>
            </div>
          </aside>
          
          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className={`
                ${viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-6'
                }
              `}>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard
                      product={product}
                      viewMode={viewMode}
                      onAddToCart={() => handleAddToCart(product)}
                      onToggleFavorite={() => handleToggleFavorite(product)}
                      isFavorite={isFavorite(product.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-text-secondary mb-6">
                  Try changing your filters to find more products
                </p>
                <button 
                  onClick={handleResetFilters}
                  className="button-primary"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const FilterSection = ({ title, count, children }) => {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="py-4 border-b border-white/10">
      <button 
        className="flex items-center justify-between w-full mb-4" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="font-bold">{title}</h3>
          {count > 0 && <span className="bg-primary px-2 rounded-full text-xs">{count}</span>}
        </div>
        <div className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <FiChevronDown size={16} />
        </div>
      </button>
      
      {isOpen && (
        <div className="mb-2">
          {children}
        </div>
      )}
    </div>
  )
}

const FilterCheckbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div className={`
        w-5 h-5 rounded flex items-center justify-center
        ${checked ? 'bg-primary' : 'border border-white/20'}
      `}>
        {checked && <FiCheck size={12} className="text-white" />}
      </div>
      <span className="text-sm">{label}</span>
    </label>
  )
}

const FilterColor = ({ colorName, selected, onClick }) => {
  const colorMap = {
    'Black': '#000000',
    'White': '#ffffff',
    'Red': '#ff0000',
    'Green': '#00ff00',
    'Blue': '#0000ff',
    'Yellow': '#ffff00',
    'Purple': '#800080',
    'Pink': '#ffc0cb',
    'Orange': '#ffa500',
    'Gray': '#808080',
    'Brown': '#a52a2a',
    'Navy': '#000080'
  }
  
  const colorHex = colorMap[colorName] || '#cccccc'
  
  return (
    <button
      onClick={onClick}
      className={`
        w-8 h-8 rounded-full transition-all
        ${selected ? 'ring-2 ring-offset-2 ring-primary ring-offset-background scale-110' : ''}
      `}
      style={{ backgroundColor: colorHex }}
      aria-label={`Color: ${colorName}`}
    />
  )
}

const FilterSize = ({ size, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        min-w-[36px] h-9 px-2 rounded transition-colors
        ${selected 
          ? 'bg-primary text-white' 
          : 'bg-white/5 hover:bg-white/10'
        }
      `}
    >
      {size}
    </button>
  )
}

const SortOption = ({ value, current, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center w-full px-4 py-2 text-left transition-colors
        ${current === value ? 'text-primary' : 'hover:bg-white/5'}
      `}
    >
      {current === value && (
        <FiCheck size={16} className="mr-2" />
      )}
      <span>{label}</span>
    </button>
  )
}

const getSortLabel = (sortValue) => {
  switch (sortValue) {
    case 'price-low-high': return 'Price: Low to High'
    case 'price-high-low': return 'Price: High to Low'
    case 'popularity': return 'Most Popular'
    case 'rating': return 'Highest Rated'
    case 'newest': 
    default: return 'Newest First'
  }
}

export default CategoryPage