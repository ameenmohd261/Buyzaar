import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiCamera, FiArrowLeft, FiArrowRight, FiCheck, FiRepeat } from 'react-icons/fi'
import { useScan } from '../hooks/useScan'
import { useUserStore } from '../store/userStore'

const ScanningPage = () => {
  const { startScan, scanProgress, scanning, error } = useScan()
  const [scanStage, setScanStage] = useState('intro') // intro, permissions, front, side, processing, complete
  const [countdown, setCountdown] = useState(null)
  const videoRef = useRef(null)
  const navigate = useNavigate()
  const setAvatarData = useUserStore((state) => state.setAvatarData)
  
  // Handle video stream
  useEffect(() => {
    let stream = null
    
    const setupCamera = async () => {
      if (scanStage === 'front' || scanStage === 'side') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: 1280, height: 720 }
          })
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          console.error('Error accessing camera:', err)
          setScanStage('permissions')
        }
      }
    }
    
    setupCamera()
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [scanStage])
  
  // Handle countdown
  useEffect(() => {
    let timer
    
    if (countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      } else {
        // Take photo
        handleCapture()
        setCountdown(null)
      }
    }
    
    return () => clearTimeout(timer)
  }, [countdown])
  
  const startCountdown = () => {
    setCountdown(3)
  }
  
  const handleCapture = () => {
    // Here you would capture the image from video
    // For demo purposes, we'll just move to the next stage
    
    if (scanStage === 'front') {
      setScanStage('side')
    } else if (scanStage === 'side') {
      setScanStage('processing')
      processScan()
    }
  }
  
  const processScan = async () => {
    try {
      await startScan()
      setScanStage('complete')
      
      // Mock avatar data - would come from the scan API
      const mockAvatarData = {
        id: `avatar-${Date.now()}`,
        measurementData: {
          height: 175, // cm
          shoulder: 42, // cm
          chest: 95, // cm
          waist: 82, // cm
          hips: 96, // cm
          inseam: 81, // cm
        },
        facialFeatures: {
          faceShape: 'oval',
          skinTone: 'medium',
        },
        model3dUrl: '/assets/models/avatar.glb',
        createdAt: new Date().toISOString(),
      }
      
      setAvatarData(mockAvatarData)
    } catch (err) {
      console.error('Scan processing error:', err)
    }
  }
  
  const goToTryOn = () => {
    navigate('/try-on')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center">
        {scanStage !== 'intro' && (
          <button 
            onClick={() => scanStage === 'complete' ? navigate('/') : setScanStage(scanStage === 'front' ? 'permissions' : scanStage === 'side' ? 'front' : scanStage === 'processing' ? 'side' : 'intro')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-2xl font-bold mx-auto">3D Body Scan</h1>
      </header>
      
      <div className="flex-grow flex items-center justify-center p-6">
        {scanStage === 'intro' && (
          <motion.div 
            className="glassmorphism p-8 max-w-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
              <FiCamera size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Create Your 3D Model</h2>
            <p className="text-text-secondary mb-8">
              We'll guide you through a quick scanning process to create your personalized 3D model. This helps you try on clothes virtually and get accurate size recommendations.
            </p>
            <div className="space-y-4">
              <button 
                onClick={() => setScanStage('permissions')} 
                className="button-primary w-full"
              >
                Start Scan
              </button>
              <button 
                onClick={() => navigate('/')} 
                className="button-secondary w-full"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        )}
        
        {scanStage === 'permissions' && (
          <motion.div 
            className="glassmorphism p-8 max-w-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
            <p className="text-text-secondary mb-6">
              Buyzaar needs access to your camera to create a personalized 3D model. Your privacy is important to us - scan data is only used to improve your shopping experience.
            </p>
            <div className="mb-6 p-4 bg-white/5 rounded-lg">
              <h3 className="font-bold mb-2">What We Do With Your Data</h3>
              <ul className="text-left text-text-secondary space-y-2">
                <li className="flex items-start">
                  <FiCheck className="text-success mt-1 mr-2 flex-shrink-0" />
                  <span>Create accurate body measurements</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-success mt-1 mr-2 flex-shrink-0" />
                  <span>Provide personalized size recommendations</span>
                </li>
                <li className="flex items-start">
                  <FiCheck className="text-success mt-1 mr-2 flex-shrink-0" />
                  <span>Generate a 3D avatar for virtual try-on</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={() => setScanStage('front')} 
              className="button-primary w-full flex items-center justify-center space-x-2"
            >
              <span>Allow Camera Access</span>
              <FiArrowRight />
            </button>
          </motion.div>
        )}
        
        {(scanStage === 'front' || scanStage === 'side') && (
          <motion.div 
            className="w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glassmorphism p-4 mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {scanStage === 'front' ? 'Front View Scan' : 'Side View Scan'}
              </h2>
              <p className="text-text-secondary">
                {scanStage === 'front' 
                  ? 'Stand 6 feet away and face the camera directly.' 
                  : 'Turn to your side and remain in the frame.'}
              </p>
            </div>
            
            <div className="aspect-[3/4] rounded-2xl overflow-hidden glassmorphism relative">
              {/* Camera feed */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay for positioning guide */}
              <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-8 flex items-center justify-center">
                <div className="text-primary/30">
                  {scanStage === 'front' ? (
                    <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M60 40 C35 40 35 60 35 100 C35 160 85 160 85 100 C85 60 85 40 60 40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="60" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  ) : (
                    <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M40 40 C40 40 60 40 80 40 C100 40 100 80 100 100 C100 120 100 160 80 160 C60 160 40 160 40 160 L40 40" stroke="currentColor" strokeWidth="2" />
                      <circle cx="70" cy="20" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-8xl font-bold text-white">{countdown}</div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex space-x-4">
              <button 
                onClick={startCountdown}
                className="button-primary flex-grow flex items-center justify-center space-x-2"
                disabled={countdown !== null}
              >
                <FiCamera size={20} />
                <span>{scanStage === 'front' ? 'Capture Front View' : 'Capture Side View'}</span>
              </button>
            </div>
          </motion.div>
        )}
        
        {scanStage === 'processing' && (
          <motion.div 
            className="glassmorphism p-8 max-w-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-t-primary border-white/10 animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Creating Your 3D Model</h2>
            <p className="text-text-secondary mb-6">
              Our AI is processing your scans to create an accurate 3D model. This will only take a moment.
            </p>
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: '0%' }}
                animate={{ width: `${scanProgress}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary mt-2">{scanProgress}% complete</p>
          </motion.div>
        )}
        
        {scanStage === 'complete' && (
          <motion.div 
            className="glassmorphism p-8 max-w-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <FiCheck size={48} className="text-success" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Scan Complete!</h2>
            <p className="text-text-secondary mb-8">
              Your 3D model has been created successfully. You can now try on clothes virtually and get personalized recommendations.
            </p>
            <div className="space-y-4">
              <button 
                onClick={goToTryOn} 
                className="button-primary w-full flex items-center justify-center space-x-2"
              >
                <span>Start Shopping</span>
                <FiArrowRight />
              </button>
              <button 
                onClick={() => setScanStage('intro')} 
                className="button-secondary w-full flex items-center justify-center space-x-2"
              >
                <FiRepeat size={18} />
                <span>Redo Scan</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ScanningPage