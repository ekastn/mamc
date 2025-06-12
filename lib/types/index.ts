/**
 * Main types for the music collaboration application
 */

// User types
export interface User {
  id: string
  name: string
  email?: string
  avatar: string
  role: "owner" | "editor" | "viewer"
  mood: "happy" | "sad" | "frustrated" | "neutral"
}

// Auth types
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  isAuthenticated: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Re-export project types
export * from './project'

// Comment types
export interface Comment {
  id: string
  position: number
  timePosition: number
  user: User
  text: string
  emotion: "happy" | "sad" | "frustrated" | "neutral"
  timestamp: string
  hasConflict?: boolean
  likes?: number
  replies?: number
}

// File upload types
export interface UploadFile {
  id: string
  name: string
  size: number
  type: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
  url?: string
}
