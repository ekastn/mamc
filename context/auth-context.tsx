"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/lib/types"

interface AuthContextType {
  user: AuthUser | null
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auth-user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user:", error)
        localStorage.removeItem("auth-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo authentication - accept any email/password
    if (credentials.email && credentials.password) {
      const authUser: AuthUser = {
        id: "demo-user-1",
        name: credentials.email.split("@")[0] || "User",
        email: credentials.email,
        avatar: "/placeholder-user.jpg",
        isAuthenticated: true,
      }

      setUser(authUser)
      localStorage.setItem("auth-user", JSON.stringify(authUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo registration - accept any valid data
    if (
      credentials.name &&
      credentials.email &&
      credentials.password &&
      credentials.password === credentials.confirmPassword
    ) {
      const authUser: AuthUser = {
        id: `demo-user-${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        avatar: "/placeholder-user.jpg",
        isAuthenticated: true,
      }

      setUser(authUser)
      localStorage.setItem("auth-user", JSON.stringify(authUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("auth-user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
