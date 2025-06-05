import type { Project, User, Comment, Version } from "./types"

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

// Sample projects
export const SAMPLE_PROJECTS: Project[] = [
  {
    id: "1",
    title: "Summer Vibes EP",
    description: "Electronic dance collaboration",
    collaborators: [SAMPLE_USERS[0], SAMPLE_USERS[1], SAMPLE_USERS[2]],
    tracks: [
      { id: "1", name: "Main Track", duration: "3:24", color: "bg-[#E41E26]", audioUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/SampleAudio_0.4mb.mp3" },
      { id: "2", name: "Vocals", duration: "3:24", color: "bg-[#1C3F95]", audioUrl: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3" },
      { id: "3", name: "Bass", duration: "3:24", color: "bg-[#FFD500]", audioUrl: "https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/11/file_example_MP3_700KB.mp3" },
    ],
    tags: ["electronic", "dance", "summer"],
    lastUpdated: "2024-01-15",
    version: "v2.1",
    color: "bg-[#E41E26]",
  },
  {
    id: "2",
    title: "Acoustic Sessions",
    description: "Unplugged versions of popular tracks",
    collaborators: [SAMPLE_USERS[0], SAMPLE_USERS[2]],
    tracks: [
      { id: "4", name: "Acoustic Guitar", duration: "4:12", color: "bg-[#1C3F95]", audioUrl: "https://download.samplelib.com/mp3/sample-12s.mp3" },
      { id: "5", name: "Vocals", duration: "4:12", color: "bg-[#FFD500]", audioUrl: "https://download.samplelib.com/mp3/sample-9s.mp3" },
    ],
    tags: ["acoustic", "unplugged"],
    lastUpdated: "2024-01-14",
    version: "v1.3",
    color: "bg-[#1C3F95]",
  },
]

// Sample comments
export const SAMPLE_COMMENTS: Comment[] = [
  {
    id: "1",
    position: 25,
    timePosition: 45,
    user: SAMPLE_USERS[1],
    text: "Love the bassline here! Really drives the energy forward.",
    emotion: "happy",
    timestamp: "2024-01-15T10:30:00Z",
    likes: 3,
    replies: 1,
  },
  {
    id: "2",
    position: 60,
    timePosition: 120,
    user: SAMPLE_USERS[2],
    text: "The transition feels a bit abrupt. Maybe we could add a smoother fade?",
    emotion: "neutral",
    timestamp: "2024-01-15T11:15:00Z",
    hasConflict: true,
    likes: 1,
    replies: 2,
  },
]

// Sample versions
export const SAMPLE_VERSIONS: Version[] = [
  {
    id: "1",
    name: "Initial Upload",
    user: SAMPLE_USERS[0],
    timestamp: "2024-01-10T09:00:00Z",
    changes: ["Added main track", "Set up project structure"],
    isCurrent: false,
    type: "upload",
    files: ["main-track.mp3"],
  },
  {
    id: "2",
    name: "Added Vocals",
    user: SAMPLE_USERS[2],
    timestamp: "2024-01-12T14:30:00Z",
    changes: ["Added vocal track", "Adjusted levels"],
    isCurrent: false,
    type: "upload",
    files: ["vocals.mp3"],
  },
  {
    id: "3",
    name: "Current Version",
    user: SAMPLE_USERS[1],
    timestamp: "2024-01-15T16:45:00Z",
    changes: ["Enhanced bass", "Fixed timing issues", "Added effects"],
    isCurrent: true,
    type: "edit",
    files: ["bass-enhanced.mp3", "effects.mp3"],
  },
]

// Navigation items
export const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: "Home" },
  { name: "Projects", href: "/projects", icon: "Music" },
  { name: "Analytics", href: "/analytics", icon: "BarChart3" },
  { name: "Collaborators", href: "/collaborators", icon: "Users" },
  { name: "Profile", href: "/profile", icon: "User" },
  { name: "Settings", href: "/settings", icon: "Settings" },
]
