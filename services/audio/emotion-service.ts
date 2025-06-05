/**
 * Service for emotion-related functionality
 */
import { EMOTIONS } from "@/lib/constants/audio"
import type { Emotion, EmotionType } from "@/lib/types/audio"

class EmotionService {
  /**
   * Get all available emotions
   * @returns Array of all emotion objects
   */
  getAllEmotions(): Emotion[] {
    return EMOTIONS
  }

  /**
   * Get the CSS color class for an emotion
   * @param emotion - The emotion to get the color for
   * @returns CSS class for the emotion color
   */
  getEmotionColor(emotion: EmotionType | string): string {
    const normalizedEmotion = emotion.toLowerCase() as EmotionType

    // Find the emotion in the EMOTIONS array
    const emotionData = EMOTIONS.find((e) => e.name.toLowerCase() === normalizedEmotion)

    if (emotionData) {
      return emotionData.color
    }

    // Default colors for common emotions if not found in EMOTIONS
    switch (normalizedEmotion) {
      case "happy":
        return "bg-[#FFD500]"
      case "sad":
        return "bg-[#1C3F95]"
      case "frustrated":
        return "bg-[#E41E26]"
      case "neutral":
        return "bg-black"
      default:
        return "bg-gray-400" // Default fallback
    }
  }

  /**
   * Get the CSS border color class for an emotion
   * @param emotion - The emotion to get the border color for
   * @returns CSS class for the emotion border color
   */
  getEmotionBorderColor(emotion: EmotionType | string): string {
    const normalizedEmotion = emotion.toLowerCase() as EmotionType

    // Find the emotion in the EMOTIONS array
    const emotionData = EMOTIONS.find((e) => e.name.toLowerCase() === normalizedEmotion)

    if (emotionData) {
      return emotionData.borderColor
    }

    // Default border colors for common emotions if not found in EMOTIONS
    switch (normalizedEmotion) {
      case "happy":
        return "border-[#FFD500]"
      case "sad":
        return "border-[#1C3F95]"
      case "frustrated":
        return "border-[#E41E26]"
      case "neutral":
        return "border-black"
      default:
        return "border-gray-400" // Default fallback
    }
  }

  /**
   * Get the CSS background color class for an emotion
   * @param emotion - The emotion to get the background color for
   * @returns CSS class for the emotion background color
   */
  getEmotionBgColor(emotion: EmotionType | string): string {
    const normalizedEmotion = emotion.toLowerCase() as EmotionType

    // Find the emotion in the EMOTIONS array
    const emotionData = EMOTIONS.find((e) => e.name.toLowerCase() === normalizedEmotion)

    if (emotionData) {
      return emotionData.bgColor
    }

    // Default background colors for common emotions if not found in EMOTIONS
    switch (normalizedEmotion) {
      case "happy":
        return "bg-[#FFD500]/10"
      case "sad":
        return "bg-[#1C3F95]/10"
      case "frustrated":
        return "bg-[#E41E26]/10"
      case "neutral":
        return "bg-black/10"
      default:
        return "bg-gray-50" // Default fallback
    }
  }

  /**
   * Get all emotion data for a specific emotion
   * @param emotion - The emotion to get data for
   * @returns Object with all emotion styling data
   */
  getEmotionData(emotion: EmotionType | string) {
    const normalizedEmotion = emotion.toLowerCase() as EmotionType
    return (
      EMOTIONS.find((e) => e.name.toLowerCase() === normalizedEmotion) || {
        name: normalizedEmotion,
        color: this.getEmotionColor(normalizedEmotion),
        borderColor: this.getEmotionBorderColor(normalizedEmotion),
        bgColor: this.getEmotionBgColor(normalizedEmotion),
        icon: "■", // Default Bauhaus-style icon
        category: "neutral" as const,
      }
    )
  }

  /**
   * Get emotions by category
   * @param category - The category to filter emotions by
   * @returns Array of emotions in the specified category
   */
  getEmotionsByCategory(category: "positive" | "neutral" | "negative"): Emotion[] {
    return EMOTIONS.filter((emotion) => emotion.category === category)
  }

  /**
   * Get emotion gradient for visualization
   * @param emotion - The emotion to get the gradient for
   * @returns CSS gradient class for the emotion
   */
  getEmotionGradient(emotion: string): string {
    switch (emotion.toLowerCase()) {
      case "happy":
        return "bg-gradient-to-r from-[#FFD500] to-[#FFA500]"
      case "sad":
        return "bg-gradient-to-r from-[#1C3F95] to-[#0F2A63]"
      case "frustrated":
        return "bg-gradient-to-r from-[#E41E26] to-[#B71C1C]"
      case "neutral":
        return "bg-gradient-to-r from-black to-gray-800"
      default:
        return "bg-black"
    }
  }
}

export const emotionService = new EmotionService()
