/**
 * Constants related to user data
 */

import type { UserProfile, NotificationSettings, SecuritySettings } from "@/lib/types/user"
import type { User } from "@/lib/types"

// Sample users
export const SAMPLE_USERS: User[] = [
  {
    id: "1",
    name: "Jamie Davis",
    avatar: "/placeholder-user.jpg",
    role: "owner",
    mood: "happy",
  },
  {
    id: "2",
    name: "Alex Chen",
    avatar: "/placeholder-user.jpg",
    role: "editor",
    mood: "neutral",
  },
  {
    id: "3",
    name: "Sarah Wilson",
    avatar: "/placeholder-user.jpg",
    role: "editor",
    mood: "happy",
  },
  {
    id: "4",
    name: "Mike Johnson",
    avatar: "/placeholder-user.jpg",
    role: "viewer",
    mood: "frustrated",
  },
]

// Sample user profile data
export const SAMPLE_USER: UserProfile = {
  id: "user-1",
  name: "Jamie Doe",
  username: "jamiedoe",
  email: "jamie@example.com",
  avatar: "/placeholder-user.jpg",
  bio: "Music producer and sound designer with a passion for electronic and ambient music. Always looking for interesting collaborations.",
  role: "Producer/Sound Designer",
  joinDate: "January 2023",
  location: "Berlin, Germany",
  website: "https://jamiedoe.com",
  socialLinks: {
    twitter: "https://twitter.com/jamiedoe",
    instagram: "https://instagram.com/jamiedoe",
    soundcloud: "https://soundcloud.com/jamiedoe",
  },
  skills: ["Sound Design", "Mixing", "Mastering", "Synthesis", "Arrangement"],
  instruments: ["Synthesizers", "Piano", "Guitar", "Drum Programming"],
  genres: ["Electronic", "Ambient", "Experimental", "Dance"],
  stats: {
    projects: 12,
    collaborations: 28,
    followers: 156,
    following: 89,
  },
  preferences: {
    theme: "system",
    emailNotifications: true,
    pushNotifications: true,
  },
}

// Sample notification settings
export const SAMPLE_NOTIFICATION_SETTINGS: NotificationSettings = {
  comments: true,
  mentions: true,
  projectUpdates: true,
  newCollaborators: true,
  versionHistory: false,
  emailDigest: "weekly",
}

// Sample security settings
export const SAMPLE_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: "3 months ago",
  connectedAccounts: {
    google: true,
    apple: false,
    facebook: false,
  },
}
