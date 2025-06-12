/**
 * Constants related to comment data
 */

import type { Comment } from "@/lib/types"
import { SAMPLE_USERS } from "./user"

// Sample comments
export const SAMPLE_COMMENTS = [
  {
    id: "1",
    position: 25,
    timePosition: 45,
    user: SAMPLE_USERS[1],
    text: "Love the bassline here! Really drives the energy forward.",
    emotion: "happy",
    timestamp: "2024-01-15T10:30:00Z",
    likes: 3,
    replies: 1
  },
  {
    id: "2",
    position: 60,
    timePosition: 120,
    user: SAMPLE_USERS[2],
    text: "The transition feels a bit abrupt. Maybe we could add a smoother fade?",
    emotion: "neutral",
    timestamp: "2024-01-15T11:15:00Z",
    hasConflict: true,
    likes: 1,
    replies: 2
  }
] as Comment[];
