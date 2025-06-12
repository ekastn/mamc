import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { COLOR_CLASSES } from "./constants/theme"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Enum representing supported mood/emotion states
 */
export type MoodState = "happy" | "sad" | "frustrated" | "neutral" | "excited" | "calm" | "tired"

/**
 * Get color for mood/emotion indicator 
 * 
 * @param mood The mood or emotion state
 * @returns Tailwind background color class for the mood
 */
export function getMoodColor(mood: string): string {
  const normalizedMood = mood.toLowerCase()
  
  switch (normalizedMood) {
    case "happy":
    case "excited":
      return COLOR_CLASSES.BG.YELLOW
    case "sad":
    case "tired":
    case "calm":
      return COLOR_CLASSES.BG.BLUE
    case "frustrated":
      return COLOR_CLASSES.BG.RED
    case "neutral":
    default:
      return COLOR_CLASSES.BG.BLACK
  }
}

/**
 * Get text color for mood/emotion indicator
 * 
 * @param mood The mood or emotion state
 * @returns Tailwind text color class for the mood
 */
export function getMoodTextColor(mood: string): string {
  const normalizedMood = mood.toLowerCase()
  
  switch (normalizedMood) {
    case "happy":
    case "excited":
      return COLOR_CLASSES.TEXT.BLACK
    case "sad":
    case "tired":
    case "calm":
    case "frustrated":
    case "neutral":
    default:
      return COLOR_CLASSES.TEXT.WHITE
  }
}

/**
 * Get border color class for mood/emotion indicator
 * 
 * @param mood The mood or emotion state
 * @returns Tailwind border color class for the mood
 */
export function getMoodBorderColor(mood: string): string {
  const normalizedMood = mood.toLowerCase()
  
  switch (normalizedMood) {
    case "happy":
    case "excited":
      return COLOR_CLASSES.BORDER.YELLOW
    case "sad":
    case "tired":
    case "calm":
      return COLOR_CLASSES.BORDER.BLUE
    case "frustrated":
      return COLOR_CLASSES.BORDER.RED
    case "neutral":
    default:
      return COLOR_CLASSES.BORDER.BLACK
  }
}

/**
 * Get border color class for emotion - alias for getMoodBorderColor for backward compatibility
 * @deprecated Use getMoodBorderColor instead
 */
export function getEmotionBorderColor(emotion: string): string {
  return getMoodBorderColor(emotion)
}

/**
 * Get emotion color - alias for getMoodColor for backward compatibility
 * @deprecated Use getMoodColor instead
 */
export function getEmotionColor(emotion: string): string {
  return getMoodColor(emotion)
}

/**
 * Get emoji icon for a mood/emotion
 * 
 * @param emotion The mood or emotion state
 * @returns Emoji representing the mood
 */
export function getMoodIcon(emotion: string): string {
  const normalizedEmotion = emotion.toLowerCase()
  
  switch (normalizedEmotion) {
    case "happy":
      return "😊"
    case "excited":
      return "🤩"
    case "sad":
      return "😢"
    case "tired":
      return "😴"
    case "calm":
      return "😌"
    case "frustrated":
      return "😤"
    case "neutral":
    default:
      return "😐"
  }
}

/**
 * Get emotion icon - alias for getMoodIcon for backward compatibility
 * @deprecated Use getMoodIcon instead
 */
export function getEmotionIcon(emotion: string): string {
  return getMoodIcon(emotion)
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
