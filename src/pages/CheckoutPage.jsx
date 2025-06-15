import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiCreditCard, FiShoppingBag, FiTruck, FiUser, FiX } from 'react-icons/fi'
import { useCartStore } from '../store/cartStore'
import { useUserStore } from '../store/userStore'
import { formatPrice } from '../utils/formatters'

const CheckoutPage = () => {
  const [step, setStep] = useState(1) // 1: Cart, 2: Shipping, 3: Payment, 4: Confirmation
  const navigate = useNavigate()
  
  const { items, subtotal, shipping, tax, total, removeItem, updateQuantity, clearCart } = useCartStore()
  const user = useUserStore((state) => state.user)
  
  // Shipping form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  })
  
  // Payment form state
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: ''
  })
  
  // Shipping method
  const [shippingMethod, setShippingMethod] = useState('standard')
  
  // Fill shipping info with user data if available
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'US'
      }))
    }
  }, [user])
  
  // Handle quantity change
  const handleQuantityChange = (index, quantity) => {
    updateQuantity(index, quantity)
  }
  
  // Handle item removal
  const handleRemoveItem = (index) => {
    removeItem(index)
  }
  
  // Handle shipping form change
  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle payment form change
  const handlePaymentInfoChange = (e) => {
    const { name, value } = e.target
    setPaymentInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Handle shipping method change
  const handleShippingMethodChange = (method) => {
    setShippingMethod(method)
  }
  
  // Continue to next step
  const handleContinue = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }
  
  // Go back to previous step
  const handleBack = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }
  
  // Handle order completion
  const handleCompleteOrder = () => {
    // In a real app, you would process payment and create an order here
    setStep(4)
    clearCart()
    window.scrollTo(0, 0)
  }
  
  // Go to homepage after order completion
  const handleGoToHome = () => {
    navigate('/')
  }
  
  if (step === 4) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-6 py-10">
          <div className="max-w-2xl mx-auto">
            <motion.div
              className="glassmorphism p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 rounded-full bg-success/20 mx-auto flex items-center justify-center mb-6">
                <FiCheck size={36} className="text-success" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-text-secondary mb-8">
                Your order has been placed and is being processed. You will receive an email confirmation shortly.
              </p>
              
              <div className="mb-8">
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <h3 className="font-bold mb-2">Order Number</h3>
                  <p className="text-primary font-mono">#ORD-{Date.now().toString().slice(-8)}</p>
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-bold mb-2">Estimated Delivery</h3>
                  <p>
                    {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleGoToHome}
                  className="button-primary flex-1"
                >
                  Continue Shopping
                </button>
                <Link to="/profile" className="button-secondary flex-1">
                  View Order
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-text-secondary hover:text-primary">
            <FiArrowLeft className="mr-2" />
            <span>Continue Shopping</span>
          </Link>
        </div>
        
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          {/* Main Content */}
          <div className="w-full lg:flex-grow">
            {/* Checkout Steps */}
            <CheckoutSteps currentStep={step} />
            
            {/* Step Content */}
            <div className="mt-8">
              {step === 1 && (
                <CartStep 
                  items={items} 
                  onQuantityChange={handleQuantityChange} 
                  onRemoveItem={handleRemoveItem}
                  onContinue={handleContinue}
                />
              )}
              
              {step === 2 && (
                <ShippingStep 
                  shippingInfo={shippingInfo}
                  onChange={handleShippingInfoChange}
                  shippingMethod={shippingMethod}
                  onShippingMethodChange={handleShippingMethodChange}
                  onBack={handleBack}
                  onContinue={handleContinue}
                />
              )}
              
              {step === 3 && (
                <PaymentStep 
                  paymentInfo={paymentInfo}
                  onChange={handlePaymentInfoChange}
                  onBack={handleBack}
                  onComplete={handleCompleteOrder}
                />
              )}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="w-full lg:w-96 lg:flex-shrink-0">
            <OrderSummary 
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Cart', icon: FiShoppingBag },
    { number: 2, title: 'Shipping', icon: FiTruck },
    { number: 3, title: 'Payment', icon: FiCreditCard }
  ]
  
  return (
    <div className="flex justify-between">
      {steps.map((step) => (
        <div 
          key={step.number}
          className="flex flex-1 items-center"
        >
          <div className={`
            flex flex-col items-center
            ${step.number < currentStep ? 'text-success' : 
              step.number === currentStep ? 'text-primary' : 
              'text-text-secondary'}
          `}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center mb-2
              ${step.number < currentStep ? 'bg-success/20' : 
                step.number === currentStep ? 'bg-primary/20' : 
                'bg-white/10'}
            `}>
              <step.icon size={18} />
            </div>
            <span className="text-sm hidden sm:block">{step.title}</span>
          </div>
          
          {step.number < steps.length && (
            <div className={`
              flex-1 h-0.5 mx-2
              ${step.number < currentStep ? 'bg-success' : 'bg-white/10'}
            `} />
          )}
        </div>
      ))}
    </div>
  )
}

const CartStep = ({ items, onQuantityChange, onRemoveItem, onContinue }) => {
  if (items.length === 0) {
    return (
      <div className="glassmorphism p-8 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-text-secondary mb-6">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Link to="/category/all" className="button-primary inline-flex">
          Start Shopping
        </Link>
      </div>
    )
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      
      <div className="glassmorphism rounded-xl overflow-hidden mb-6">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 text-text-secondary font-medium">
          <div className="col-span-6">Product</div>
          <div className="col-span-2 text-center">Price</div>
          <div className="col-span-2 text-center">Quantity</div>
          <div className="col-span-2 text-center">Total</div>
        </div>
        
        <div className="divide-y divide-white/10">
          {items.map((item, index) => (
            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`} className="grid grid-cols-12 gap-4 p-4 items-center">
              <div className="col-span-6">
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.id}`} className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={item.thumbnail} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/product/${item.id}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <div className="text-text-secondary text-sm mt-1 space-y-1">
                      <p>Size: {item.selectedSize}</p>
                      <p>Color: {item.selectedColor?.name}</p>
                    </div>
                    <button 
                      onClick={() => onRemoveItem(index)}
                      className="text-text-secondary hover:text-primary text-sm flex items-center mt-2"
                    >
                      <FiX size={14} className="mr-1" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-center">
                ${item.price.toFixed(2)}
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="flex items-center">
                  <button 
                    onClick={() => onQuantityChange(index, item.quantity - 1)}
                    className="w-8 h-8 rounded-l-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <div className="w-10 h-8 flex items-center justify-center">
                    {item.quantity}
                  </div>
                  <button 
                    onClick={() => onQuantityChange(index, item.quantity + 1)}
                    className="w-8 h-8 rounded-r-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-center font-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={onContinue}
          className="button-primary"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  )
}

const ShippingStep = ({ 
  shippingInfo, 
  onChange, 
  shippingMethod, 
  onShippingMethodChange, 
  onBack, 
  onContinue 
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Shipping Information</h2>
      
      <div className="glassmorphism p-6 rounded-xl mb-6">
        <form onSubmit={(e) => {
          e.preventDefault()
          onContinue()
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={shippingInfo.email}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={shippingInfo.phone}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium mb-2">
                Address *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingInfo.address}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={shippingInfo.city}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium mb-2">
                State/Province *
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={shippingInfo.state}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium mb-2">
                ZIP/Postal Code *
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={onChange}
                required
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country *
              </label>
              <select
                id="country"
                name="country"
                value={shippingInfo.country}
                onChange={onChange}
                required
                className="input-field"
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
              </select>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="font-bold mb-4">Shipping Method</h3>
            
            <div className="space-y-4">
              <ShippingMethodOption 
                id="standard"
                name="Standard Shipping"
                description="3-5 Business Days"
                price={0}
                selected={shippingMethod === 'standard'}
                onChange={() => onShippingMethodChange('standard')}
              />
              <ShippingMethodOption 
                id="express"
                name="Express Shipping"
                description="2-3 Business Days"
                price={9.99}
                selected={shippingMethod === 'express'}
                onChange={() => onShippingMethodChange('express')}
              />
              <ShippingMethodOption 
                id="overnight"
                name="Overnight Shipping"
                description="Next Business Day"
                price={19.99}
                selected={shippingMethod === 'overnight'}
                onChange={() => onShippingMethodChange('overnight')}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={onBack}
              className="button-secondary"
            >
              Back to Cart
            </button>
            <button 
              type="submit"
              className="button-primary"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ShippingMethodOption = ({ id, name, description, price, selected, onChange }) => {
  return (
    <label className="flex items-center p-4 rounded-lg cursor-pointer transition-colors border border-white/10 hover:border-primary/50">
      <input
        type="radio"
        name="shippingMethod"
        id={id}
        checked={selected}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`
        w-5 h-5 rounded-full border-2 mr-4 flex-shrink-0
        ${selected ? 'border-primary' : 'border-white/30'}
      `}>
        {selected && <div className="w-3 h-3 bg-primary rounded-full m-0.5" />}
      </div>
      <div className="flex-grow">
        <div className="font-medium">{name}</div>
        <div className="text-text-secondary text-sm">{description}</div>
      </div>
      <div className="ml-4 font-bold">
        {price === 0 ? 'FREE' : `$${price.toFixed(2)}`}
      </div>
    </label>
  )
}

const PaymentStep = ({ paymentInfo, onChange, onBack, onComplete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      
      <div className="glassmorphism p-6 rounded-xl mb-6">
        <form onSubmit={(e) => {
          e.preventDefault()
          onComplete()
        }}>
          <div className="mb-8">
            <h3 className="font-bold mb-4">Payment Method</h3>
            
            <div className="p-4 bg-white/5 rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <div className="w-5 h-5 rounded-full border-2 border-primary mr-4 flex-shrink-0">
                  <div className="w-3 h-3 bg-primary rounded-full m-0.5" />
                </div>
                <div className="font-medium">Credit Card</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="cardName" className="block text-sm font-medium mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentInfo.cardName}
                    onChange={onChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={onChange}
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="input-field font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Expiration Date *
                  </label>
                  <div className="flex space-x-4">
                    <select
                      id="expMonth"
                      name="expMonth"
                      value={paymentInfo.expMonth}
                      onChange={onChange}
                      required
                      className="input-field"
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>
                          {month.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <select
                      id="expYear"
                      name="expYear"
                      value={paymentInfo.expYear}
                      onChange={onChange}
                      required
                      className="input-field"
                    >
                      <option value="">Year</option>
                      {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium mb-2">
                    CVV *
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={onChange}
                    required
                    placeholder="123"
                    maxLength={4}
                    className="input-field w-24 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8 p-4 bg-white/5 rounded-lg border border-primary/30">
            <div className="flex items-start">
              <div className="mt-0.5 mr-4">
                <FiCheck size={18} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Billing address same as shipping</p>
                <p className="text-text-secondary text-sm mt-1">
                  {shippingInfo.firstName} {shippingInfo.lastName}, {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}, {shippingInfo.country}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="button"
              onClick={onBack}
              className="button-secondary"
            >
              Back to Shipping
            </button>
            <button 
              type="submit"
              className="button-primary"
            >
              Complete Order
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const OrderSummary = ({ items, subtotal, shipping, tax, total, step }) => {
  return (
    <div className="glassmorphism p-6 rounded-xl sticky top-28">
      <h3 className="text-xl font-bold mb-6">Order Summary</h3>
      
      <div className="max-h-80 overflow-y-auto mb-6">
        {items.map((item) => (
          <div 
            key={`${item.id}-${item.selectedSize}-${item.selectedColor?.name}`}
            className="flex items-center space-x-4 mb-4"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img 
                src={item.thumbnail} 
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-medium line-clamp-1">{item.name}</h4>
              <div className="text-text-secondary text-sm">
                <span>Size: {item.selectedSize}</span>
                <span className="mx-1">•</span>
                <span>Qty: {item.quantity}</span>
              </div>
            </div>
            <div className="font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t border-white/10 pt-4 mb-4">
        <div className="flex justify-between py-2">
          <span className="text-text-secondary">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-secondary">Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-text-secondary">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex justify-between py-4 border-t border-white/10">
        <span className="text-lg font-bold">Total</span>
        <span className="text-lg font-bold">${total.toFixed(2)}</span>
      </div>
      
      {step === 1 && (
        <div className="mt-4 text-center text-text-secondary text-sm">
          Shipping and taxes calculated at checkout
        </div>
      )}
    </div>
  )
}

export default CheckoutPage