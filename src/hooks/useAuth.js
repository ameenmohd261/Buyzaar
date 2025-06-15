import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../store/userStore'

export const useAuth = () => {
  const navigate = useNavigate()
  const { 
    user,
    login: storeLogin,
    logout: storeLogout,
    register: storeRegister,
    checkAuthStatus,
    loading, 
    error 
  } = useUserStore()
  const [redirectPath, setRedirectPath] = useState('/')
  
  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])
  
  // Login handler
  const login = useCallback(async (email, password) => {
    try {
      await storeLogin(email, password)
      navigate(redirectPath || '/')
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }, [storeLogin, navigate, redirectPath])
  
  // Logout handler
  const logout = useCallback(() => {
    storeLogout()
    navigate('/login')
  }, [storeLogout, navigate])
  
  // Register handler
  const register = useCallback(async (userData) => {
    try {
      await storeRegister(userData)
      navigate(redirectPath || '/')
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }, [storeRegister, navigate, redirectPath])
  
  // Set redirect path
  const setRedirect = useCallback((path) => {
    setRedirectPath(path)
  }, [])
  
  // Require auth - use this in protected routes
  const requireAuth = useCallback((callback) => {
    if (loading) return
    
    if (!user) {
      setRedirectPath(window.location.pathname)
      navigate('/login')
      return false
    }
    
    if (callback) callback()
    return true
  }, [user, loading, navigate, setRedirectPath])
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    requireAuth,
    setRedirect
  }
}