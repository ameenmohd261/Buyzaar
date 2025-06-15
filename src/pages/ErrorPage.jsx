import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft } from 'react-icons/fi'

const ErrorPage = () => {
  const navigate = useNavigate()
  
  const handleGoBack = () => {
    navigate(-1)
  }
  
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center">
      <div className="container max-w-2xl mx-auto px-6 py-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
            <p className="text-text-secondary text-lg mb-8">
              The page you were looking for doesn't exist or has been moved.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button 
              onClick={handleGoBack}
              className="button-secondary flex items-center justify-center space-x-2"
            >
              <FiArrowLeft />
              <span>Go Back</span>
            </button>
            <Link to="/" className="button-primary">
              Return to Home
            </Link>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="fixed -z-10 top-1/3 right-1/4 w-64 h-64 bg-primary/20 rounded-full filter blur-3xl opacity-30" />
        <div className="fixed -z-10 bottom-1/4 left-1/3 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl opacity-30" />
      </div>
    </div>
  )
}

export default ErrorPage