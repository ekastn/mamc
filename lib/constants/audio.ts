// Constants for the audio module
import { EMOTIONS, Emotion, EmotionCategory } from "@/lib/constants/emotions"
import { COLOR_CLASSES } from "@/lib/constants/theme"

// Type definitions
export type EmotionType = string

/**
 * Service for emotion-related functionality
 */
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
        return COLOR_CLASSES.BG.YELLOW
      case "sad":
        return COLOR_CLASSES.BG.BLUE
      case "frustrated":
        return COLOR_CLASSES.BG.RED
      case "neutral":
        return COLOR_CLASSES.BG.BLACK
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
        return COLOR_CLASSES.BORDER.YELLOW
      case "sad":
        return COLOR_CLASSES.BORDER.BLUE
      case "frustrated":
        return COLOR_CLASSES.BORDER.RED
      case "neutral":
        return COLOR_CLASSES.BORDER.BLACK
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
        return COLOR_CLASSES.BG.YELLOW_LIGHT
      case "sad":
        return COLOR_CLASSES.BG.BLUE_LIGHT
      case "frustrated":
        return COLOR_CLASSES.BG.RED_LIGHT
      case "neutral":
        return COLOR_CLASSES.BG.BLACK_LIGHT
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
        emoji: "■", // Default Bauhaus-style icon
        category: "neutral" as EmotionCategory,
        textColor: "text-white"
      }
    )
  }

  /**
   * Get emotions by category
   * @param category - The category to filter emotions by
   * @returns Array of emotions in the specified category
   */
  getEmotionsByCategory(category: EmotionCategory): Emotion[] {
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
        return COLOR_CLASSES.GRADIENT.YELLOW
      case "sad":
        return COLOR_CLASSES.GRADIENT.BLUE
      case "frustrated":
        return COLOR_CLASSES.GRADIENT.RED
      case "neutral":
        return COLOR_CLASSES.GRADIENT.BLACK
      default:
        return COLOR_CLASSES.BG.BLACK
    }
  }
}

export const emotionService = new EmotionService()
