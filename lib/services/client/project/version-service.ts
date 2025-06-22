import { ProjectTrack, TrackVersion, Checkpoint, Project } from '@/lib/types/project'

class VersionService {
  /**
   * Create a new version for a track
   */
  createTrackVersion(track: ProjectTrack, audioUrl: string, authorId: string, changes: string[]): TrackVersion {
    const version: TrackVersion = {
      id: `${track.id}_v${track.versions.length + 1}`,
      number: `v${track.versions.length + 1}`,
      audioUrl,
      timestamp: new Date().toISOString(),
      authorId,
      changes
    }
    return version
  }

  /**
   * Create a checkpoint for the project
   */
  createCheckpoint(project: Project, name: string, authorId: string, label?: string, description?: string): Checkpoint {
    const trackVersions: Record<string, string> = {}
    
    // Get current version ID for each track
    project.tracks.forEach(track => {
      trackVersions[track.id] = track.currentVersionId
    })

    const checkpoint: Checkpoint = {
      id: `${project.id}_cp_${Date.now()}`,
      name,
      label: label || `v${project.checkpoints.length + 1}.0`,
      timestamp: new Date().toISOString(),
      authorId,
      trackVersions,
      description
    }

    return checkpoint
  }

  /**
   * Apply a checkpoint to restore track versions
   */
  applyCheckpoint(project: Project, checkpointId: string): boolean {
    try {
      const checkpoint = project.checkpoints.find(cp => cp.id === checkpointId)
      if (!checkpoint) return false

      // Update current version for each track
      project.tracks.forEach(track => {
        if (checkpoint.trackVersions[track.id]) {
          track.currentVersionId = checkpoint.trackVersions[track.id]
        }
      })

      project.currentCheckpointId = checkpointId
      return true
    } catch (error) {
      console.error("Error applying checkpoint:", error)
      return false
    }
  }

  /**
   * Get track version by ID
   */
  getTrackVersion(track: ProjectTrack, versionId: string): TrackVersion | undefined {
    try {
      if (!track || !versionId) return undefined
      return track.versions.find(v => v.id === versionId)
    } catch (error) {
      console.error("Error getting track version:", error)
      return undefined
    }
  }
}

export const versionService = new VersionService()
