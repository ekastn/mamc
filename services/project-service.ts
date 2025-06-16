import type { Project, Comment, Version } from "@/lib/types/index"
import { SAMPLE_PROJECTS, SAMPLE_COMMENTS, SAMPLE_VERSIONS } from "@/lib/constants/index"
import { versionService } from "./project/version-service"

class ProjectService {
  private projects: Project[] = SAMPLE_PROJECTS
  private comments: Comment[] = SAMPLE_COMMENTS
  private versions: Version[] = SAMPLE_VERSIONS

  // Helper methods
  generateId(prefix: string = ""): string {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
  
  formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  // Project methods
  getAllProjects(): Project[] {
    try {
      if (!this.projects || !Array.isArray(this.projects)) {
        console.error("Projects is not properly initialized:", this.projects);
        return [];
      }
      return this.projects;
    } catch (error) {
      console.error("Error getting all projects:", error);
      return [];
    }
  }

  getProjectById(id: string): Project | null {
    return this.projects.find((project) => project.id === id) || null
  }

  createProject(projectData: Omit<Project, "id">): Project {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}`,
    }
    this.projects.push(newProject)
    return newProject
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projectIndex = this.projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) return null

    this.projects[projectIndex] = { ...this.projects[projectIndex], ...updates }
    return this.projects[projectIndex]
  }

  deleteProject(id: string): boolean {
    const projectIndex = this.projects.findIndex((p) => p.id === id)
    if (projectIndex === -1) return false

    this.projects.splice(projectIndex, 1)
    return true
  }

  // Comment methods
  getProjectComments(projectId: string): Comment[] {
    return this.comments.filter((comment) => comment.id.startsWith(projectId))
  }

  addComment(projectId: string, commentData: Omit<Comment, "id">): Comment {
    const newComment: Comment = {
      ...commentData,
      id: `${projectId}-comment-${Date.now()}`,
    }
    this.comments.push(newComment)
    return newComment
  }

  // Version methods
  getProjectVersions(projectId: string): Version[] {
    return this.versions.filter((version) => version.id.startsWith(projectId))
  }

  createVersion(projectId: string, versionData: Omit<Version, "id">): Version {
    const newVersion: Version = {
      ...versionData,
      id: `${projectId}-version-${Date.now()}`,
    }
    this.versions.push(newVersion)
    return newVersion
  }
  
  // Checkpoint methods
  createCheckpoint(projectId: string, name: string, label?: string, description?: string): boolean {
    try {
      const project = this.getProjectById(projectId);
      if (!project) return false;
      
      // Use the version service to create a checkpoint
      const checkpoint = versionService.createCheckpoint(
        project, 
        name,
        project.collaborators[0].id, // Use the first collaborator as the author (in a real app, this would be the current user)
        label,
        description
      );
      
      // Add the checkpoint to the project
      if (!project.checkpoints) {
        project.checkpoints = [];
      }
      
      project.checkpoints.push(checkpoint);
      
      // Set this as the current checkpoint
      project.currentCheckpointId = checkpoint.id;
      
      // Update the project
      this.updateProject(projectId, { 
        checkpoints: project.checkpoints,
        currentCheckpointId: checkpoint.id
      });
      
      return true;
    } catch (error) {
      console.error("Error creating checkpoint:", error);
      return false;
    }
  }
  
  applyCheckpoint(projectId: string, checkpointId: string): boolean {
    try {
      const project = this.getProjectById(projectId);
      if (!project) return false;
      
      // Use the version service to apply the checkpoint
      const success = versionService.applyCheckpoint(project, checkpointId);
      
      if (success) {
        // Update the project with the current checkpoint ID
        this.updateProject(projectId, { 
          currentCheckpointId: checkpointId
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error applying checkpoint:", error);
      return false;
    }
  }

  /**
   * Upload a new version for a track
   */
  uploadTrackVersion(
    projectId: string, 
    trackId: string, 
    audioUrl: string, 
    changes: string[],
    isNewTrack: boolean = false,
    newTrackName?: string
  ): boolean {
    try {
      const project = this.getProjectById(projectId);
      if (!project) return false;

      // Import the track upload service here to avoid circular dependencies
      const { trackUploadService } = require("./project/track-upload-service");
      
      // Use first collaborator as the author (in a real app, this would be the current user)
      const authorId = project.collaborators[0].id;
      
      const result = trackUploadService.uploadTrackVersion(
        project, 
        trackId, 
        audioUrl, 
        authorId, 
        changes,
        isNewTrack,
        newTrackName
      );
      
      if (result.success) {
        // Update the project
        this.updateProject(projectId, { 
          tracks: project.tracks
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error uploading track version:", error);
      return false;
    }
  }
}

export const projectService = new ProjectService()
