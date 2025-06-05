
export type User = {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
  mood: 'happy' | 'sad' | 'frustrated' | 'neutral';
}

export type Track = {
  id: string;
  name: string;
  duration: string;
  color: string;
  audioUrl?: string;
}

export type Comment = {
  id: string;
  position: number;
  timePosition: number;
  user: User;
  text: string;
  emotion: 'happy' | 'sad' | 'frustrated' | 'neutral';
  timestamp: string;
  hasConflict?: boolean;
  likes?: number;
  replies?: number;
}

export type Project = {
  id: string;
  title: string;
  description: string;
  collaborators: User[];
  tracks: Track[];
  tags: string[];
  lastUpdated: string;
  version: string;
  color: string;
}

export type Version = {
  id: string;
  name: string;
  user: User;
  timestamp: string;
  changes?: string[];
}
