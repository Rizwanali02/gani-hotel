"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"

type AuthUser = {
  _id: string
  email: string
  name: string
  avatarUrl: string
  role: 'USER' | 'ADMIN'
} | null

type AuthContextType = {
  user: AuthUser
  role: string | null
  loading: boolean
  signIn: (credential: string) => Promise<{ success: boolean; error?: string }>
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  registerWithEmail: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  signIn: async () => ({ success: false }),
  loginWithEmail: async () => ({ success: false }),
  registerWithEmail: async () => ({ success: false }),
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setRole(data.user?.role || null)
      } else {
        setUser(null)
        setRole(null)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null)
      setRole(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // ✅ Updated: Accept Google credential (ID token)
  const signIn = async (credential: string) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }), // Send as credential
      })

      const data = await response.json()

      if (data.success) {
        await fetchUser()
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Sign in failed' }
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchUser()
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Login failed' }
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const registerWithEmail = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchUser()
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Registration failed' }
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setUser(null)
      setRole(null)
    }
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, signIn, loginWithEmail, registerWithEmail, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)