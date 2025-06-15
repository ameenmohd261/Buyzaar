import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { FiArrowRight, FiCamera, FiTrendingUp, FiUsers } from 'react-icons/fi'
import LoadingSpinner from '../components/animations/LoadingSpinner'
import { useTheme } from '../context/ThemeContext'
import FeaturedProducts from '../components/product/FeaturedProducts'

// This is a placeholder for your Three.js component
const HeroModel = () => null

const HomePage = () => {
  const { theme } = useTheme()
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        ref={targetRef}
        style={{ opacity, scale, y }}
        className="h-screen relative flex items-center"
      >
        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div 
            className="flex flex-col justify-center pt-10"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Try Before</span>
              <br />
              You Buy
            </h1>
            <p className="text-lg max-w-lg mb-8 text-text-secondary">
              Experience the future of shopping with Buyzaar's AI-powered virtual try-on. See how clothes look on your 3D model before purchasing.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/try-on" className="button-primary flex items-center justify-center space-x-2 group">
                <span>Try Now</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/category/all" className="button-secondary text-center">
                Browse Collection
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="h-[500px] relative hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* 3D Avatar Display */}
            <div className="absolute inset-0 z-10">
              <Canvas>
                <Suspense fallback={null}>
                  <HeroModel />
                </Suspense>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
              </Canvas>
              
              {/* Fallback for 3D model (static placeholder) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src={`/assets/hero-model-${theme === 'dark' ? 'dark' : 'light'}.png`} 
                  alt="Virtual fashion model" 
                  className="object-contain h-full"
                />
              </div>
            </div>
            
            {/* Gradient background for 3D model */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl filter blur-3xl opacity-50 -z-10 animate-pulse-slow" />
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/3 right-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-float" />
        <div className="absolute -z-10 bottom-1/4 left-1/3 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "-2s" }} />
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: 1.5,
            repeat: Infinity, 
            repeatType: "reverse" 
          }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              How <span className="gradient-text">Buyzaar</span> Works
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Virtual try-on experience powered by AI and 3D technology
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              icon={<FiCamera size={32} />}
              title="1. Scan Yourself"
              description="Create your digital twin with our 3D scanning technology. Quick, secure, and amazingly accurate."
              delay={0}
              animationPath="/animations/scan.json"
            />
            <StepCard 
              icon={<FiTrendingUp size={32} />}
              title="2. Get Recommendations"
              description="Our AI analyzes your features to suggest clothes and styles that will look best on you."
              delay={0.2}
              animationPath="/animations/recommendations.json"
            />
            <StepCard 
              icon={<FiUsers size={32} />}
              title="3. Try & Buy"
              description="See how clothes look on your 3D model before purchasing. No more size or style surprises."
              delay={0.4}
              animationPath="/animations/tryon.json"
            />
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h2 className="text-4xl font-bold mb-4">
                Featured <span className="gradient-text">Collection</span>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl">
                Explore our curated selection of trending styles
              </p>
            </div>
            <Link to="/category/featured" className="mt-4 md:mt-0 button-secondary flex items-center space-x-2 group">
              <span>View All</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
          
          <FeaturedProducts />
        </div>
      </section>
      
      {/* AI Style Assistant Banner */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="glassmorphism overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl opacity-20 -z-10" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-20 -z-10" />
            
            <div className="grid md:grid-cols-2 gap-12 p-8 md:p-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl font-bold mb-6">
                    Your Personal <span className="gradient-text">Style AI</span>
                  </h2>
                  <p className="text-lg text-text-secondary mb-6">
                    Get personalized fashion recommendations based on your features, body type, and style preferences. Our AI stylist helps you look your best for any occasion.
                  </p>
                  <Link to="/style-assistant" className="button-primary inline-flex items-center space-x-2 group">
                    <span>Meet Your Stylist</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative aspect-[4/3] rounded-xl overflow-hidden glow"
              >
                <img 
                  src="/assets/style-assistant-preview.jpg" 
                  alt="AI Style Assistant" 
                  className="object-cover w-full h-full"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-background/90">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              What Our <span className="gradient-text">Users Say</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Join thousands of satisfied Buyzaar shoppers
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                name={testimonial.name}
                role={testimonial.role}
                quote={testimonial.quote}
                image={testimonial.image}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to <span className="gradient-text">Transform</span> Your Shopping Experience?
            </h2>
            <p className="text-lg text-text-secondary mb-10">
              Join Buyzaar today and discover the perfect fit every time with our AI-powered virtual try-on technology.
            </p>
            <Link to="/scan" className="button-primary inline-flex items-center space-x-2 text-lg py-4 px-8">
              <span>Create Your 3D Model</span>
              <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

const StepCard = ({ icon, title, description, delay, animationPath }) => {
  return (
    <motion.div 
      className="glassmorphism p-8 group hover:border-primary/30 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="mb-6 h-16 w-16 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center text-primary">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-text-secondary">
        {description}
      </p>
    </motion.div>
  )
}

const TestimonialCard = ({ name, role, quote, image, delay }) => {
  return (
    <motion.div 
      className="glassmorphism p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {/* Quote mark */}
      <div className="absolute top-6 right-6 text-6xl text-primary/10 font-serif">
        "
      </div>
      
      <div className="mb-6 flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img 
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-text-secondary text-sm">{role}</p>
        </div>
      </div>
      
      <p className="text-text-secondary italic relative z-10">"{quote}"</p>
    </motion.div>
  )
}

const testimonials = [
  {
    name: "Sophie Chen",
    role: "Fashion Blogger",
    quote: "Buyzaar's virtual try-on is a game-changer! I can see exactly how clothes will look before buying. The AI recommendations are spot-on for my style.",
    image: "/assets/testimonials/sophie.jpg"
  },
  {
    name: "Marcus Johnson",
    role: "Product Designer",
    quote: "As someone who hates returning clothes, this app is a lifesaver. The 3D scanning is surprisingly accurate and the interface is beautifully designed.",
    image: "/assets/testimonials/marcus.jpg"
  },
  {
    name: "Priya Sharma",
    role: "Marketing Director",
    quote: "I've reduced my returns by 80% since I started using Buyzaar. The style recommendations have helped me step out of my comfort zone with confidence.",
    image: "/assets/testimonials/priya.jpg"
  }
]

export default HomePage