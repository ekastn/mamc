export interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  bio: string
  jobTitle?: string
  joinDate: string
  location: string
  website?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    soundcloud?: string
    youtube?: string
  }
  skills: string[]
  instruments: string[]
  genres: string[]
  stats: {
    projects: number
    collaborations: number
  }
  preferences: {
    theme: "light" | "dark" | "system"
    emailNotifications: boolean
    pushNotifications: boolean
  }
}

export interface NotificationSettings {
  comments: boolean
  mentions: boolean
  projectUpdates: boolean
  newCollaborators: boolean
  versionHistory: boolean
  emailDigest: "daily" | "weekly" | "never"
}

export interface SecuritySettings {
  twoFactorEnabled: boolean
  lastPasswordChange: string
  connectedAccounts: {
    google: boolean
    apple: boolean
    facebook: boolean
  }
}
