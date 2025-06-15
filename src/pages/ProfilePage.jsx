import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiPackage, FiHeart, FiUser, FiCreditCard, FiMapPin, FiLogOut, FiEdit } from 'react-icons/fi'
import { useUserStore } from '../store/userStore'
import { useFavorites } from '../hooks/useFavorites'
import LoadingSpinner from '../components/animations/LoadingSpinner'
import ProductCard from '../components/product/ProductCard'

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('orders')
  const navigate = useNavigate()
  const { user, logout, loading } = useUserStore()
  const { favorites } = useFavorites()
  
  // Check if user is logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <LoadingSpinner size={60} />
      </div>
    )
  }
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="glassmorphism p-6 rounded-xl sticky top-28">
              {/* User Info */}
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                  <img 
                    src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`} 
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-text-secondary text-sm">{user?.email}</p>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="mb-6">
                <ProfileNavItem 
                  active={activeTab === 'orders'}
                  onClick={() => setActiveTab('orders')}
                  icon={<FiPackage />}
                  label="My Orders"
                />
                <ProfileNavItem 
                  active={activeTab === 'favorites'}
                  onClick={() => setActiveTab('favorites')}
                  icon={<FiHeart />}
                  label="Favorites"
                  badge={favorites.length}
                />
                <ProfileNavItem 
                  active={activeTab === 'account'}
                  onClick={() => setActiveTab('account')}
                  icon={<FiUser />}
                  label="Account Details"
                />
                <ProfileNavItem 
                  active={activeTab === 'payment'}
                  onClick={() => setActiveTab('payment')}
                  icon={<FiCreditCard />}
                  label="Payment Methods"
                />
                <ProfileNavItem 
                  active={activeTab === 'addresses'}
                  onClick={() => setActiveTab('addresses')}
                  icon={<FiMapPin />}
                  label="Addresses"
                />
              </nav>
              
              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-3 text-text-secondary hover:text-primary transition-colors w-full"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:flex-grow">
            <AnimatePresence mode="wait">
              {activeTab === 'orders' && <OrdersTab key="orders" />}
              {activeTab === 'favorites' && <FavoritesTab key="favorites" favorites={favorites} />}
              {activeTab === 'account' && <AccountTab key="account" user={user} />}
              {activeTab === 'payment' && <PaymentTab key="payment" />}
              {activeTab === 'addresses' && <AddressesTab key="addresses" user={user} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileNavItem = ({ active, onClick, icon, label, badge }) => {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center justify-between w-full py-3 px-4 rounded-lg transition-colors mb-2
        ${active ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}
      `}
    >
      <div className="flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge > 0 && (
        <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-xs">
          {badge}
        </span>
      )}
    </button>
  )
}

const OrdersTab = () => {
  // Mock orders data - in a real app, this would come from an API
  const orders = [
    {
      id: 'ORD-23456789',
      date: '2025-05-15',
      status: 'Delivered',
      total: 234.50,
      items: [
        { id: 'prod-1', name: 'Stylewise Cotton Shirt', thumbnail: '/assets/products/shirts/1.jpg', price: 89.99, quantity: 1 },
        { id: 'prod-4', name: 'Urban Threads Denim Jeans', thumbnail: '/assets/products/pants/2.jpg', price: 144.51, quantity: 1 }
      ]
    },
    {
      id: 'ORD-12345678',
      date: '2025-04-28',
      status: 'Processing',
      total: 119.97,
      items: [
        { id: 'prod-7', name: 'Apex Running Jacket', thumbnail: '/assets/products/jackets/3.jpg', price: 119.97, quantity: 1 }
      ]
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      
      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="glassmorphism p-6 rounded-xl">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold">Order #{order.id}</h3>
                  <p className="text-text-secondary text-sm">
                    Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  ${order.status === 'Delivered' ? 'bg-success/20 text-success' :
                    order.status === 'Processing' ? 'bg-primary/20 text-primary' :
                    'bg-warning/20 text-warning'}
                `}>
                  {order.status}
                </div>
              </div>
              
              <div className="divide-y divide-white/10">
                {order.items.map(item => (
                  <div key={item.id} className="py-4 flex items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                      <img 
                        src={item.thumbnail} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-text-secondary text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <div>
                  <span className="text-text-secondary">Total:</span>
                  <span className="font-bold text-lg ml-2">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex space-x-4">
                  <button className="button-secondary py-2 px-4">
                    Track Order
                  </button>
                  <button className="button-primary py-2 px-4">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glassmorphism p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
            <FiPackage size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-text-secondary mb-6">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link to="/category/all" className="button-primary inline-flex">
            Start Shopping
          </Link>
        </div>
      )}
    </motion.div>
  )
}

const FavoritesTab = ({ favorites }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">My Favorites</h2>
      
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
              isFavorite={true}
            />
          ))}
        </div>
      ) : (
        <div className="glassmorphism p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center mb-4">
            <FiHeart size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">No favorites yet</h3>
          <p className="text-text-secondary mb-6">
            You haven't added any items to your favorites yet. Click the heart icon on any product to add it here.
          </p>
          <Link to="/category/all" className="button-primary inline-flex">
            Browse Products
          </Link>
        </div>
      )}
    </motion.div>
  )
}

const AccountTab = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Account Details</h2>
      
      <div className="glassmorphism p-6 rounded-xl mb-6">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold">Personal Information</h3>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <FiEdit size={18} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-text-secondary text-sm mb-1">Full Name</h4>
            <p className="font-medium">{user?.name || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-text-secondary text-sm mb-1">Email Address</h4>
            <p className="font-medium">{user?.email || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-text-secondary text-sm mb-1">Phone Number</h4>
            <p className="font-medium">{user?.phone || 'Not provided'}</p>
          </div>
          <div>
            <h4 className="text-text-secondary text-sm mb-1">Date of Birth</h4>
            <p className="font-medium">{user?.birthDate || 'Not provided'}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold">Password</h3>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <FiEdit size={18} />
            </button>
          </div>
          <p className="text-text-secondary">Last changed on {user?.passwordLastChanged || 'Never'}</p>
        </div>
      </div>
      
      <div className="glassmorphism p-6 rounded-xl">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-bold">Notifications</h3>
          <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
            <FiEdit size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <NotificationSetting
            title="Email Notifications"
            description="Receive order updates, promotions, and product recommendations via email."
            enabled={true}
          />
          <NotificationSetting
            title="SMS Notifications"
            description="Get order updates and shipping notifications via text message."
            enabled={false}
          />
          <NotificationSetting
            title="Style Recommendations"
            description="Receive personalized style suggestions based on your preferences."
            enabled={true}
          />
        </div>
      </div>
    </motion.div>
  )
}

const NotificationSetting = ({ title, description, enabled }) => {
  return (
    <div className="flex items-start">
      <div className="flex-grow">
        <h4 className="font-medium">{title}</h4>
        <p className="text-text-secondary text-sm">{description}</p>
      </div>
      <div className={`
        w-12 h-6 rounded-full relative cursor-pointer transition-colors
        ${enabled ? 'bg-primary' : 'bg-white/10'}
      `}>
        <div className={`
          absolute w-4 h-4 bg-white rounded-full top-1
          transition-transform
          ${enabled ? 'translate-x-7' : 'translate-x-1'}
        `} />
      </div>
    </div>
  )
}

const PaymentTab = () => {
  // Mock payment methods - in a real app, this would come from an API
  const paymentMethods = [
    {
      id: 'pm-1',
      type: 'card',
      cardBrand: 'Visa',
      last4: '4242',
      expiryMonth: '04',
      expiryYear: '2026',
      isDefault: true
    },
    {
      id: 'pm-2',
      type: 'card',
      cardBrand: 'Mastercard',
      last4: '5555',
      expiryMonth: '08',
      expiryYear: '2025',
      isDefault: false
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Payment Methods</h2>
      
      <div className="glassmorphism p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Saved Payment Methods</h3>
          <button className="button-primary py-2 px-4">
            Add New Method
          </button>
        </div>
        
        <div className="space-y-4">
          {paymentMethods.map(method => (
            <div 
              key={method.id} 
              className={`
                p-4 rounded-lg border transition-colors flex justify-between items-center
                ${method.isDefault ? 'border-primary' : 'border-white/10 hover:border-white/30'}
              `}
            >
              <div className="flex items-center">
                {method.cardBrand === 'Visa' ? (
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center mr-4">
                    <span className="text-blue-500 font-bold">VISA</span>
                  </div>
                ) : method.cardBrand === 'Mastercard' ? (
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center mr-4">
                    <span className="text-red-500 font-bold">MC</span>
                  </div>
                ) : (
                  <div className="w-10 h-6 bg-white/10 rounded flex items-center justify-center mr-4">
                    <span className="font-bold">CARD</span>
                  </div>
                )}
                <div>
                  <div className="font-medium">
                    {method.cardBrand} •••• {method.last4}
                  </div>
                  <div className="text-text-secondary text-sm">
                    Expires {method.expiryMonth}/{method.expiryYear}
                    {method.isDefault && <span className="ml-2 text-primary">Default</span>}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <FiEdit size={16} />
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <FiX size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const AddressesTab = ({ user }) => {
  // Mock addresses - in a real app, this would come from an API
  const addresses = [
    {
      id: 'addr-1',
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      isDefault: true
    },
    {
      id: 'addr-2',
      name: 'Work',
      street: '456 Market St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      country: 'US',
      isDefault: false
    }
  ]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map(address => (
          <div 
            key={address.id} 
            className={`
              glassmorphism p-6 rounded-xl
              ${address.isDefault ? 'border border-primary/50' : ''}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold">{address.name}</h3>
              {address.isDefault && (
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                  Default
                </span>
              )}
            </div>
            
            <div className="space-y-1 text-text-secondary mb-6">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} {address.zipCode}</p>
              <p>{address.country}</p>
            </div>
            
            <div className="flex space-x-3">
              <button className="button-secondary py-1.5 px-3 text-sm">
                Edit
              </button>
              {!address.isDefault && (
                <button className="button-secondary py-1.5 px-3 text-sm">
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}
        
        {/* Add New Address Card */}
        <div className="glassmorphism p-6 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center h-full">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <FiMapPin size={24} />
          </div>
          <h3 className="font-bold mb-2">Add New Address</h3>
          <p className="text-text-secondary text-center mb-4">
            Add a new shipping or billing address
          </p>
          <button className="button-primary py-2 px-4">
            Add Address
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfilePage