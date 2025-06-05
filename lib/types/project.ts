/**
 * Types related to project data
 */

export interface Collaborator {
  id: string
  name: string
  avatar: string
  role: string
  mood: string
}

export interface ProjectTrack {
  id: string
  name: string
  duration: string
  type?: string
  order?: number
  muted?: boolean
  solo?: boolean
  volume?: number
}

export interface Project {
  id: string
  title: string
  description: string
  collaborators: Collaborator[]
  tracks: ProjectTrack[]
  tags: string[]
  lastUpdated: string
  version: string
  color: string
  settings?: ProjectSettings
  createdAt?: string
  updatedAt?: string
}

export interface ProjectSettings {
  tempo: number
  timeSignature: string
  key: string
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  tracks: Array<{
    name: string
    type: string
  }>
  defaultSettings: ProjectSettings
}

export interface ProjectCreationData {
  title: string
  description?: string
  tags?: string[]
  color?: string
  templateId?: string
}

export interface Version {
  id: string
  name: string
  user: {
    name: string
    avatar: string
  }
  timestamp: string
  changes: string[]
  isCurrent: boolean
}
