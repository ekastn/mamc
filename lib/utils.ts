import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get color for mood indicator
 */
export function getMoodColor(mood: string): string {
  switch (mood) {
    case "happy":
      return "bg-[#FFD500]"
    case "sad":
      return "bg-[#1C3F95]"
    case "frustrated":
      return "bg-[#E41E26]"
    default:
      return "bg-black"
  }
}

/**
 * Get emotion color
 */
export function getEmotionColor(emotion: string): string {
  switch (emotion) {
    case "happy":
      return "bg-[#FFD500]"
    case "sad":
      return "bg-[#1C3F95]"
    case "frustrated":
      return "bg-[#E41E26]"
    default:
      return "bg-black"
  }
}

/**
 * Get emotion icon
 */
export function getEmotionIcon(emotion: string): string {
  switch (emotion) {
    case "happy":
      return "😊"
    case "sad":
      return "😢"
    case "frustrated":
      return "😤"
    default:
      return "😐"
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

/**
 * Generate unique ID
 */
export function generateId(prefix = ""): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`
  }

  if (diffHours > 0) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  }

  if (diffMins > 0) {
    return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`
  }

  return "Just now"
}
