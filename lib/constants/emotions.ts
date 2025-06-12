// Constants for mood and emotion types and related data

// Type definitions
export type MoodType = "happy" | "sad" | "frustrated" | "neutral" | "excited" | "calm" | "tired"

export type EmotionCategory = "positive" | "neutral" | "negative"

export interface Emotion {
  name: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
  category: EmotionCategory
  textColor: string
}

// Emotion constants with all required properties
export const EMOTIONS: Emotion[] = [
  // Positive emotions
  { 
    name: "HAPPY", 
    emoji: "■", 
    color: "bg-[#FFD500]", 
    bgColor: "bg-[#FFD500]/10", 
    borderColor: "border-[#FFD500]",
    category: "positive",
    textColor: "text-black"
  },
  { 
    name: "EXCITED", 
    emoji: "■", 
    color: "bg-[#FFD500]", 
    bgColor: "bg-[#FFD500]/10", 
    borderColor: "border-[#FFD500]",
    category: "positive",
    textColor: "text-black"
  },
  { 
    name: "INSPIRED", 
    emoji: "■", 
    color: "bg-[#FFD500]", 
    bgColor: "bg-[#FFD500]/10", 
    borderColor: "border-[#FFD500]",
    category: "positive",
    textColor: "text-black"
  },
  { 
    name: "PROUD", 
    emoji: "■", 
    color: "bg-[#FFD500]", 
    bgColor: "bg-[#FFD500]/10", 
    borderColor: "border-[#FFD500]",
    category: "positive",
    textColor: "text-black"
  },
  { 
    name: "SATISFIED", 
    emoji: "■", 
    color: "bg-[#FFD500]", 
    bgColor: "bg-[#FFD500]/10", 
    borderColor: "border-[#FFD500]",
    category: "positive",
    textColor: "text-black"
  },

  // Neutral emotions
  { 
    name: "CALM", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "neutral",
    textColor: "text-white"
  },
  { 
    name: "FOCUSED", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "neutral",
    textColor: "text-white"
  },
  { 
    name: "NEUTRAL", 
    emoji: "■", 
    color: "bg-black", 
    bgColor: "bg-black/10", 
    borderColor: "border-black",
    category: "neutral",
    textColor: "text-white"
  },
  { 
    name: "CURIOUS", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "neutral",
    textColor: "text-white"
  },
  { 
    name: "THOUGHTFUL", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "neutral",
    textColor: "text-white"
  },

  // Negative emotions
  { 
    name: "TIRED", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "negative",
    textColor: "text-white"
  },
  { 
    name: "SAD", 
    emoji: "■", 
    color: "bg-[#1C3F95]", 
    bgColor: "bg-[#1C3F95]/10", 
    borderColor: "border-[#1C3F95]",
    category: "negative",
    textColor: "text-white"
  },
  { 
    name: "FRUSTRATED", 
    emoji: "■", 
    color: "bg-[#E41E26]", 
    bgColor: "bg-[#E41E26]/10", 
    borderColor: "border-[#E41E26]",
    category: "negative",
    textColor: "text-white"
  },
  { 
    name: "CONFUSED", 
    emoji: "■", 
    color: "bg-[#E41E26]", 
    bgColor: "bg-[#E41E26]/10", 
    borderColor: "border-[#E41E26]",
    category: "negative",
    textColor: "text-white"
  },
  { 
    name: "OVERWHELMED", 
    emoji: "■", 
    color: "bg-[#E41E26]", 
    bgColor: "bg-[#E41E26]/10", 
    borderColor: "border-[#E41E26]",
    category: "negative",
    textColor: "text-white"
  }
]

// Simple mood map for common moods
export const MOODS = {
  HAPPY: {
    name: "Happy",
    emoji: "■",
    color: "bg-[#FFD500]",
    textColor: "text-black",
    borderColor: "border-[#FFD500]"
  },
  EXCITED: {
    name: "Excited",
    emoji: "■",
    color: "bg-[#FFD500]",
    textColor: "text-black",
    borderColor: "border-[#FFD500]"
  },
  CALM: {
    name: "Calm",
    emoji: "■",
    color: "bg-[#1C3F95]",
    textColor: "text-white",
    borderColor: "border-[#1C3F95]"
  },
  NEUTRAL: {
    name: "Neutral",
    emoji: "■",
    color: "bg-black",
    textColor: "text-white",
    borderColor: "border-black"
  },
  TIRED: {
    name: "Tired",
    emoji: "■",
    color: "bg-[#1C3F95]",
    textColor: "text-white",
    borderColor: "border-[#1C3F95]"
  },
  SAD: {
    name: "Sad",
    emoji: "■",
    color: "bg-[#1C3F95]",
    textColor: "text-white",
    borderColor: "border-[#1C3F95]"
  },
  FRUSTRATED: {
    name: "Frustrated",
    emoji: "■",
    color: "bg-[#E41E26]",
    textColor: "text-white",
    borderColor: "border-[#E41E26]"
  }
}

// Map between emotion categories and colors
export const EMOTION_CATEGORY_COLORS = {
  positive: {
    bg: "bg-[#FFD500]",
    bgLight: "bg-[#FFD500]/10",
    border: "border-[#FFD500]",
    text: "text-black"
  },
  neutral: {
    bg: "bg-[#1C3F95]",
    bgLight: "bg-[#1C3F95]/10",
    border: "border-[#1C3F95]",
    text: "text-white"
  },
  negative: {
    bg: "bg-[#E41E26]",
    bgLight: "bg-[#E41E26]/10",
    border: "border-[#E41E26]",
    text: "text-white"
  }
}
