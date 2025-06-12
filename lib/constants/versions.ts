/**
 * Constants related to version history data
 */

import type { Version } from "@/lib/types"
import { SAMPLE_USERS } from "./user"

// Sample versions
export const SAMPLE_VERSIONS = [
  {
    id: "1",
    name: "Initial Upload",
    user: {
      name: SAMPLE_USERS[0].name,
      avatar: SAMPLE_USERS[0].avatar
    },
    timestamp: "2024-01-10T09:00:00Z",
    changes: ["Added main track", "Set up project structure"],
    isCurrent: false
  },
  {
    id: "2",
    name: "Added Vocals",
    user: {
      name: SAMPLE_USERS[2].name,
      avatar: SAMPLE_USERS[2].avatar
    },
    timestamp: "2024-01-12T14:30:00Z",
    changes: ["Added vocal track", "Adjusted levels"],
    isCurrent: false
  },
  {
    id: "3",
    name: "Current Version",
    user: {
      name: SAMPLE_USERS[1].name,
      avatar: SAMPLE_USERS[1].avatar
    },
    timestamp: "2024-01-15T16:45:00Z",
    changes: ["Enhanced bass", "Fixed timing issues", "Added effects"],
    isCurrent: true
  }
] as Version[];
