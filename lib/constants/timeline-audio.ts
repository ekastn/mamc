import type { ProjectTrack, TrackVersion } from "@/lib/types/project"

// Default audio URL to use when no track is selected
export const DEFAULT_AUDIO_URL = "/audio/sample-audio.mp3";

// Sample track versions for demonstration
export const SAMPLE_TRACK_VERSIONS: TrackVersion[] = [
  {
    id: "track-1_v1",
    number: "v1",
    audioUrl: "/audio/sample-audio.mp3",
    timestamp: new Date().toISOString(),
    authorId: "user-1",
    changes: ["Initial upload"]
  },
  {
    id: "track-2_v1",
    number: "v1",
    audioUrl: "/audio/sample-audio.wav",
    timestamp: new Date().toISOString(),
    authorId: "user-2",
    changes: ["Vocal track added"]
  },
  {
    id: "track-3_v1",
    number: "v1",
    audioUrl: "/audio/sample-audio.mp3",
    timestamp: new Date().toISOString(),
    authorId: "user-3",
    changes: ["Bass track added"]
  }
];

// Sample tracks with versions for timeline demonstration
export const SAMPLE_TIMELINE_TRACKS: ProjectTrack[] = [
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
];
