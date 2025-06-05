/**
 * Service for creating and managing new projects
 */
import type { Project, ProjectTemplate, ProjectCreationData } from "@/lib/types/project"
import { projectService } from "./project-service"

export class ProjectCreationService {
  private readonly templates: ProjectTemplate[] = [
    {
      id: "blank",
      name: "Blank Project",
      description: "Start with an empty project",
      icon: "📄",
      tracks: [],
      defaultSettings: {
        tempo: 120,
        timeSignature: "4/4",
        key: "C Major",
      },
    },
    {
      id: "band",
      name: "Band Recording",
      description: "Template for band recordings with multiple instruments",
      icon: "🎸",
      tracks: [
        { name: "Drums", type: "drums" },
        { name: "Bass", type: "bass" },
        { name: "Guitar 1", type: "guitar" },
        { name: "Guitar 2", type: "guitar" },
        { name: "Vocals", type: "vocals" },
      ],
      defaultSettings: {
        tempo: 120,
        timeSignature: "4/4",
        key: "C Major",
      },
    },
    {
      id: "electronic",
      name: "Electronic Music",
      description: "Template for electronic music production",
      icon: "🎛️",
      tracks: [
        { name: "Kick", type: "drums" },
        { name: "Snare", type: "drums" },
        { name: "Hi-hats", type: "drums" },
        { name: "Bass", type: "bass" },
        { name: "Lead Synth", type: "synth" },
        { name: "Pad", type: "synth" },
        { name: "FX", type: "fx" },
      ],
      defaultSettings: {
        tempo: 128,
        timeSignature: "4/4",
        key: "A Minor",
      },
    },
    {
      id: "podcast",
      name: "Podcast Recording",
      description: "Template for podcast or voice recording",
      icon: "🎙️",
      tracks: [
        { name: "Host", type: "vocals" },
        { name: "Guest", type: "vocals" },
        { name: "Intro Music", type: "music" },
        { name: "Background Music", type: "music" },
      ],
      defaultSettings: {
        tempo: 120,
        timeSignature: "4/4",
        key: "C Major",
      },
    },
  ]

  /**
   * Get all available project templates
   */
  getTemplates(): ProjectTemplate[] {
    return this.templates
  }

  /**
   * Get a specific template by ID
   */
  getTemplate(id: string): ProjectTemplate | null {
    return this.templates.find((template) => template.id === id) || null
  }

  /**
   * Create a new project from template
   */
  async createProject(data: ProjectCreationData): Promise<Project> {
    // Validate input data
    this.validateProjectData(data)

    // Get template if specified
    const template = data.templateId ? this.getTemplate(data.templateId) : null

    // Generate unique project ID
    const projectId = projectService.generateId("proj_")

    // Create project object
    const project: Project = {
      id: projectId,
      title: data.title,
      description: data.description || "",
      collaborators: [
        {
          id: "current_user", // In real app, this would be the current user ID
          name: "Current User",
          avatar: "/placeholder.svg",
          role: "Owner",
          mood: "neutral",
        },
      ],
      tracks: template ? this.createTracksFromTemplate(template) : [],
      tags: data.tags || [],
      lastUpdated: projectService.formatRelativeTime(new Date()),
      version: "1.0",
      color: data.color || "bg-[#1C3F95]",
      settings: template?.defaultSettings || {
        tempo: 120,
        timeSignature: "4/4",
        key: "C Major",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real application, this would save to a database
    // For now, we'll simulate the creation process
    await this.simulateProjectCreation(project)

    return project
  }

  /**
   * Validate project creation data
   */
  private validateProjectData(data: ProjectCreationData): void {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Project title is required")
    }

    if (data.title.length > 100) {
      throw new Error("Project title must be less than 100 characters")
    }

    if (data.description && data.description.length > 500) {
      throw new Error("Project description must be less than 500 characters")
    }

    if (data.tags && data.tags.length > 10) {
      throw new Error("Maximum 10 tags allowed")
    }

    if (data.templateId && !this.getTemplate(data.templateId)) {
      throw new Error("Invalid template ID")
    }
  }

  /**
   * Create tracks from template
   */
  private createTracksFromTemplate(template: ProjectTemplate) {
    return template.tracks.map((trackTemplate, index) => ({
      id: projectService.generateId("track_"),
      name: trackTemplate.name,
      duration: "0:00", // Will be updated when audio is added
      type: trackTemplate.type,
      order: index,
      muted: false,
      solo: false,
      volume: 1.0,
    }))
  }

  /**
   * Simulate project creation (replace with real API call)
   */
  private async simulateProjectCreation(project: Project): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real application, this would:
    // 1. Save project to database
    // 2. Create project directory structure
    // 3. Set up initial permissions
    // 4. Send notifications to collaborators
    // 5. Initialize version control

    console.log("Project created:", project)
  }

  /**
   * Duplicate an existing project
   */
  async duplicateProject(originalProjectId: string, newTitle: string): Promise<Project> {
    // Get original project
    const originalProject = projectService.getProjectById(originalProjectId)

    // Create new project data
    const duplicateData: ProjectCreationData = {
      title: newTitle,
      description: `Copy of ${originalProject.title}`,
      tags: [...originalProject.tags],
      color: originalProject.color,
    }

    // Create the duplicate
    const duplicateProject = await this.createProject(duplicateData)

    // Copy tracks (in real app, this would copy audio files too)
    duplicateProject.tracks = originalProject.tracks.map((track) => ({
      ...track,
      id: projectService.generateId("track_"),
    }))

    return duplicateProject
  }

  /**
   * Get project creation statistics
   */
  getCreationStats() {
    return {
      totalTemplates: this.templates.length,
      mostUsedTemplate: "blank", // In real app, this would come from analytics
      averageProjectsPerUser: 3.5, // In real app, this would come from database
      totalProjectsCreated: 1247, // In real app, this would come from database
    }
  }
}

export const projectCreationService = new ProjectCreationService()
