// Site-wide configuration settings
export const siteConfig = {
  // Basic site info
  name: 'Buyzaar',
  description: 'AI-powered e-commerce with 3D virtual try-on',
  domain: 'buyzaar.com',
  
  // SEO and social sharing
  title: {
    default: 'Buyzaar - Virtual Try-On Experience',
    template: '%s | Buyzaar'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://buyzaar.com',
    siteName: 'Buyzaar',
    images: [
      {
        url: 'https://buyzaar.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Buyzaar - Virtual Try-On Experience'
      }
    ]
  },
  twitter: {
    handle: '@buyzaar',
    site: '@buyzaar',
    cardType: 'summary_large_image'
  },
  
  // Feature flags
  features: {
    virtualTryOn: true,
    styleAssistant: true,
    recommendations: true,
    social: true,
    darkMode: true,
  },
  
  // App limits
  limits: {
    maxFavorites: 100,
    maxCartItems: 50,
    maxAddresses: 10,
    maxPaymentMethods: 5,
    maxRecentlyViewed: 20,
  },
  
  // Contact information
  contact: {
    email: 'support@buyzaar.com',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion St, Suite 200, San Francisco, CA 94103'
  },
  
  // Social media links
  social: {
    instagram: 'https://instagram.com/buyzaar',
    twitter: 'https://twitter.com/buyzaar',
    facebook: 'https://facebook.com/buyzaar',
    youtube: 'https://youtube.com/buyzaar'
  },
  
  // Currency settings
  currency: {
    code: 'USD',
    symbol: '$',
    decimalPlaces: 2
  },
  
  // Default image placeholders
  placeholders: {
    product: '/assets/placeholders/product.jpg',
    avatar: '/assets/placeholders/avatar.jpg',
    category: '/assets/placeholders/category.jpg'
  }
}