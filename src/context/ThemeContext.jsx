import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(undefined)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('buyzaar-theme')
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  })

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('buyzaar-theme', theme)
    
    // Update document class for tailwind
    const root = window.document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}