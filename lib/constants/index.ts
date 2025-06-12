// Export all constants from this index file
// This allows imports like import { COLORS, EMOTIONS } from "@/lib/constants"

// Re-export from individual constant files
export * from "./theme"
export * from "./emotions"
export * from "./errors"
export * from "./audio"
export * from "./navigation"
export * from "./user"
export * from "./projects"
export * from "./versions"
export * from "./comments"
export * from "./timeline-audio"

// Direct exports for commonly used constants 
// This improves discoverability and provides better IDE hints
export const {
  SAMPLE_PROJECTS,
  SAMPLE_USERS,
  SAMPLE_COMMENTS,
  SAMPLE_VERSIONS,
  SAMPLE_TIMELINE_TRACKS,
  DEFAULT_AUDIO_URL
} = {
  // Re-export from their respective files
  get SAMPLE_PROJECTS() { return require('./projects').SAMPLE_PROJECTS },
  get SAMPLE_USERS() { return require('./user').SAMPLE_USERS },
  get SAMPLE_COMMENTS() { return require('./comments').SAMPLE_COMMENTS },
  get SAMPLE_VERSIONS() { return require('./versions').SAMPLE_VERSIONS },
  get SAMPLE_TIMELINE_TRACKS() { return require('./timeline-audio').SAMPLE_TIMELINE_TRACKS },
  get DEFAULT_AUDIO_URL() { return require('./timeline-audio').DEFAULT_AUDIO_URL }
}
