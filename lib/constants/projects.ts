import type { Project } from "@/lib/types/index"
import { SAMPLE_USERS } from "./user"
import { SAMPLE_TRACK_VERSIONS } from "./timeline-audio"

// Sample projects with simplified track structure for demonstration
export const SAMPLE_PROJECTS = [
  {
    id: "1",
    title: "Summer Vibes EP",
    description: "Electronic dance collaboration",
    collaborators: [SAMPLE_USERS[0], SAMPLE_USERS[1], SAMPLE_USERS[2]],
    tracks: [
      {
        id: "track-1",
        name: "Main Track",
        duration: "3:45",
        versions: [SAMPLE_TRACK_VERSIONS[0]],
        currentVersionId: "track-1_v1"
      },
      {
        id: "track-2",
        name: "Vocals",
        duration: "3:45",
        versions: [SAMPLE_TRACK_VERSIONS[1]],
        currentVersionId: "track-2_v1"
      },
      {
        id: "track-3",
        name: "Bass",
        duration: "3:45",
        versions: [SAMPLE_TRACK_VERSIONS[2]],
        currentVersionId: "track-3_v1"
      }
    ],
    tags: ["electronic", "dance"],
    lastUpdated: "2024-01-15",
    color: "bg-[#1C3F95]",
    checkpoints: []
  },
  {
    id: "2",
    title: "Acoustic Sessions",
    description: "Unplugged acoustic set",
    collaborators: [SAMPLE_USERS[2], SAMPLE_USERS[3]],
    tracks: [
      {
        id: "track-4",
        name: "Guitar",
        duration: "2:58",
        versions: [
          {
            id: "track-4_v1",
            number: "v1",
            audioUrl: "/audio/sample-guitar.mp3",
            timestamp: new Date().toISOString(),
            authorId: "user-2",
            changes: ["Initial guitar track"]
          }
        ],
        currentVersionId: "track-4_v1"
      },
      {
        id: "track-5",
        name: "Vocals",
        duration: "2:58",
        versions: [
          {
            id: "track-5_v1",
            number: "v1",
            audioUrl: "/audio/sample-acoustic-vocals.mp3",
            timestamp: new Date().toISOString(),
            authorId: "user-3",
            changes: ["Initial vocal track"]
          }
        ],
        currentVersionId: "track-5_v1"
      }
    ],
    tags: ["acoustic", "unplugged"],
    lastUpdated: "2024-01-14",
    color: "bg-[#1C3F95]",
    checkpoints: []
  }
] as Project[];
