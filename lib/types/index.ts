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

// Project types
export interface Project {
  id: string
  title: string
  description: string
  collaborators: User[]
  tracks: Track[]
  tags: string[]
  lastUpdated: string
  version: string
  color: string
}

export interface Track {
  id: string
  name: string
  duration: string
  color: string
  audioUrl?: string
}

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

// Version types
export interface Version {
  id: string
  name: string
  user: User
  timestamp: string
  changes: string[]
  isCurrent: boolean
  type: "upload" | "edit" | "milestone"
  files?: string[]
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
