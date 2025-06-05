import type { Project, Comment, Version } from "@/lib/types"
import { SAMPLE_PROJECTS, SAMPLE_COMMENTS, SAMPLE_VERSIONS } from "@/lib/constants"

class ProjectService {
  private projects: Project[] = SAMPLE_PROJECTS
  private comments: Comment[] = SAMPLE_COMMENTS
  private versions: Version[] = SAMPLE_VERSIONS

  // Project methods
  getAllProjects(): Project[] {
    return this.projects
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

  // Utility methods
  getMoodColor(mood: string): string {
    switch (mood) {
      case "happy":
        return "bg-[#FFD500]"
      case "sad":
        return "bg-[#1C3F95]"
      case "frustrated":
        return "bg-[#E41E26]"
      default:
        return "bg-black"
    }
  }

  getEmotionColor(emotion: string): string {
    return this.getMoodColor(emotion)
  }
}

export const projectService = new ProjectService()
