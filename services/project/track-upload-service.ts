import type { Project, ProjectTrack, TrackVersion } from "@/lib/types/project"
import { versionService } from "./version-service"

class TrackUploadService {
  /**
   * Add a new track to a project
   */
  createTrack(project: Project, trackName: string): ProjectTrack {
    const newTrack: ProjectTrack = {
      id: `track-${Date.now()}`,
      name: trackName,
      duration: "0:00", // Will be updated once audio is processed
      versions: [],
      currentVersionId: ""
    }
    
    return newTrack
  }

  /**
   * Upload a new version for a track
   */
  uploadTrackVersion(
    project: Project, 
    trackId: string, 
    audioUrl: string, 
    authorId: string, 
    changes: string[],
    isNewTrack: boolean = false,
    newTrackName?: string
  ): { 
    track: ProjectTrack,
    version: TrackVersion,
    success: boolean
  } {
    try {
      // Check if we need to create a new track
      let track: ProjectTrack
      
      if (isNewTrack && newTrackName) {
        // Create a new track
        track = this.createTrack(project, newTrackName)
        
        // Add to project tracks
        project.tracks.push(track)
      } else {
        // Find existing track
        const existingTrack = project.tracks.find(t => t.id === trackId)
        
        if (!existingTrack) {
          throw new Error(`Track with ID ${trackId} not found`)
        }
        
        track = existingTrack
      }
      
      // Create a new version
      const newVersion = versionService.createTrackVersion(track, audioUrl, authorId, changes)
      
      // Add version to track
      track.versions.push(newVersion)
      
      // Update current version
      track.currentVersionId = newVersion.id
      
      return {
        track,
        version: newVersion,
        success: true
      }
    } catch (error) {
      console.error("Error uploading track version:", error)
      return {
        track: null as any,
        version: null as any,
        success: false
      }
    }
  }
}

export const trackUploadService = new TrackUploadService()
