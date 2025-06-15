import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      avatarData: null,
      loading: false,
      error: null,
      preferences: {
        stylePreferences: [],
        sizePreferences: {},
        colorPreferences: [],
      },
      tryOnHistory: [],
      orders: [],
      
      // Check authentication status
      checkAuthStatus: async () => {
        set({ loading: true })
        
        try {
          // In a real app, this would be an API call to verify the token
          // For now, we'll just check if there's a user in the store
          const user = get().user
          
          // If no user is found, set to null
          if (!user) {
            set({ user: null, loading: false })
            return false
          }
          
          // If user is found, keep them logged in
          set({ loading: false })
          return true
        } catch (error) {
          set({ error, user: null, loading: false })
          return false
        }
      },
      
      // Login
      login: async (email, password) => {
        set({ loading: true })
        
        try {
          // Mock login - in a real app, this would be an API call
          const mockUser = {
            id: 'user-1',
            name: 'John Doe',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1 (555) 123-4567',
            avatarUrl: `https://ui-avatars.com/api/?name=John+Doe&background=random`,
            address: {
              street: '123 Main St',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'US',
            },
            passwordLastChanged: '2025-01-15'
          }
          
          set({ user: mockUser, loading: false })
          return mockUser
        } catch (error) {
          set({ error, loading: false })
          throw error
        }
      },
      
      // Logout
      logout: () => {
        set({
          user: null,
          avatarData: null,
          error: null
        })
      },
      
      // Register
      register: async (userData) => {
        set({ loading: true })
        
        try {
          // Mock register - in a real app, this would be an API call
          const mockUser = {
            id: 'user-' + Date.now(),
            ...userData,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName + '+' + userData.lastName)}&background=random`,
            passwordLastChanged: new Date().toISOString().split('T')[0]
          }
          
          set({ user: mockUser, loading: false })
          return mockUser
        } catch (error) {
          set({ error, loading: false })
          throw error
        }
      },
      
      // Update user profile
      updateProfile: (profileData) => {
        set((state) => ({
          user: {
            ...state.user,
            ...profileData
          }
        }))
      },
      
      // Set avatar data
      setAvatarData: (avatarData) => set({ avatarData }),
      
      // Add style preference
      addStylePreference: (style) => 
        set((state) => ({
          preferences: {
            ...state.preferences,
            stylePreferences: [...state.preferences.stylePreferences, style]
          }
        })),
      
      // Remove style preference
      removeStylePreference: (style) => 
        set((state) => ({
          preferences: {
            ...state.preferences,
            stylePreferences: state.preferences.stylePreferences.filter(s => s !== style)
          }
        })),
      
      // Update size preferences
      updateSizePreferences: (sizes) => 
        set((state) => ({
          preferences: {
            ...state.preferences,
            sizePreferences: { ...state.preferences.sizePreferences, ...sizes }
          }
        })),
      
      // Add try-on to history
      addTryOnToHistory: (tryOnSession) => 
        set((state) => ({
          tryOnHistory: [tryOnSession, ...state.tryOnHistory].slice(0, 20) // Keep last 20
        })),
        
      // Add order
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders]
        })),
    }),
    {
      name: 'buyzaar-user-storage',
      partialize: (state) => ({
        user: state.user,
        avatarData: state.avatarData,
        preferences: state.preferences,
        tryOnHistory: state.tryOnHistory,
      }),
    }
  )
)