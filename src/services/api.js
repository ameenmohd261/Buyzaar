import { getApiUrl } from '../constants/apiEndpoints'

// Base API class for handling API requests
class Api {
  constructor() {
    this.baseUrl = getApiUrl('')
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
  
  // Set authentication token
  setToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`
    } else {
      delete this.headers['Authorization']
    }
  }
  
  // Handle API errors
  handleError(error) {
    // Network error
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection and try again.',
        status: 0
      })
    }
    
    // API error with response
    const { status, data } = error.response
    
    // Handle common status codes
    switch (status) {
      case 401:
        // Authentication error - could trigger logout
        return Promise.reject({
          message: data.message || 'Your session has expired. Please log in again.',
          status
        })
      case 403:
        return Promise.reject({
          message: data.message || 'You do not have permission to access this resource.',
          status
        })
      case 404:
        return Promise.reject({
          message: data.message || 'The requested resource was not found.',
          status
        })
      case 422:
        return Promise.reject({
          message: data.message || 'Validation failed.',
          errors: data.errors || {},
          status
        })
      case 429:
        return Promise.reject({
          message: data.message || 'Too many requests. Please try again later.',
          status
        })
      case 500:
      case 502:
      case 503:
      case 504:
        return Promise.reject({
          message: data.message || 'Server error. Please try again later.',
          status
        })
      default:
        return Promise.reject({
          message: data.message || 'Something went wrong.',
          status
        })
    }
  }
  
  // GET request
  async get(url, params = {}) {
    try {
      // Build URL with query parameters
      const queryString = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&')
        
      const fullUrl = queryString ? `${url}?${queryString}` : url
      
      // Fetch request
      const response = await fetch(this.baseUrl + fullUrl, {
        method: 'GET',
        headers: this.headers
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  // POST request
  async post(url, data = {}) {
    try {
      const response = await fetch(this.baseUrl + url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  // PUT request
  async put(url, data = {}) {
    try {
      const response = await fetch(this.baseUrl + url, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  // DELETE request
  async delete(url) {
    try {
      const response = await fetch(this.baseUrl + url, {
        method: 'DELETE',
        headers: this.headers
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  // PATCH request
  async patch(url, data = {}) {
    try {
      const response = await fetch(this.baseUrl + url, {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
  
  // For file uploads
  async upload(url, formData) {
    const headers = { ...this.headers }
    delete headers['Content-Type'] // Let browser set content type with boundary
    
    try {
      const response = await fetch(this.baseUrl + url, {
        method: 'POST',
        headers,
        body: formData
      })
      
      if (!response.ok) {
        throw { response }
      }
      
      return await response.json()
    } catch (error) {
      return this.handleError(error)
    }
  }
}

// Create and export a singleton instance
export const api = new Api()

export default api