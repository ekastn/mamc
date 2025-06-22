export enum CollaboratorRole {
    OWNER = "OWNER",
    PRODUCER = "PRODUCER",
    MIXER = "MIXER",
    MEMBER = "MEMBER",
    MODERATOR = "MODERATOR",
}

export enum CommentFeelingTag {
    HAPPY = "HAPPY",
    EXCITED = "EXCITED",
    INSPIRED = "INSPIRED",
    PROUD = "PROUD",
    SATISFIED = "SATISFIED",
    CALM = "CALM",
    FOCUSED = "FOCUSED",
    NEUTRAL = "NEUTRAL",
    CURIOUS = "CURIOUS",
    THOUGHTFUL = "THOUGHTFUL",
    TIRED = "TIRED",
    SAD = "SAD",
    FRUSTRATED = "FRUSTRATED",
    CONFUSED = "CONFUSED",
    OVERWHELMED = "OVERWHELMED",
}

export enum ConflictStatus {
    OPEN = "OPEN",
    ESCALATED = "ESCALATED",
    RESOLVED = "RESOLVED",
    DISMISSED = "DISMISSED",
}

export enum ResolutionType {
    MUTUAL_AGREEMENT = "MUTUAL_AGREEMENT",
    MEDIATED_RESOLUTION = "MEDIATED_RESOLUTION",
    POLICY_ENFORCEMENT = "POLICY_ENFORCEMENT",
    NO_ACTION_NEEDED = "NO_ACTION_NEEDED",
}

export interface User {
    id: string; // Clerk user ID
    username: string;
    email: string;
    imageUrl?: string;
    firstName?: string;
    lastName?: string;
    createdAt: Date;
    updatedAt: Date;
    profile?: Profile;
    ownedProjects: Project[];
    collaborations: ProjectCollaborator[];
    uploadedVersions: TrackVersion[];
    createdCheckpoints: Checkpoint[];
    comments: TrackComment[];
    reportedConflicts: Conflict[];
    resolvedConflicts: ConflictResolution[];
}

export interface Profile {
    userId: string;
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    jobTitle?: string;
    location?: string;
    website?: string;
    projectsCount: number;
    collaborationsCount: number;
    socialLinks: Record<string, any>;
    preferences: Record<string, any>;
    user: User;
}

export interface Tag {
    id: number;
    name: string;
    projects: Project[];
}

export interface Project {
    id: string;
    ownerId: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    collaborators: ProjectCollaborator[];
    tracks: Track[];
    checkpoints: Checkpoint[];
    tags: Tag[];
    conflicts: Conflict[];
}

export interface ProjectCollaborator {
    projectId: string;
    userId: string;
    role: CollaboratorRole;
    joinedAt: Date;
    project: Project;
    user: User;
}

export interface Track {
    id: string;
    projectId: string;
    name: string;
    trackOrder?: number;
    createdAt: Date;
    project: Project;
    versions: TrackVersion[];
}

export interface TrackVersion {
    id: string;
    trackId: string;
    uploadedById: string;
    versionNumber: number;
    notes?: string;
    fileUrl: string;
    fileSizeBytes?: bigint;
    durationSeconds?: number;
    createdAt: Date;
    track: Track;
    uploader: User;
    checkpointEntries: CheckpointTrackVersion[];
    comments: TrackComment[];
}

export interface Checkpoint {
    id: string;
    projectId: string;
    createdById: string;
    name: string;
    description?: string;
    createdAt: Date;
    project: Project;
    creator: User;
    trackVersions: CheckpointTrackVersion[];
}

export interface CheckpointTrackVersion {
    checkpointId: string;
    trackVersionId: string;
    checkpoint: Checkpoint;
    trackVersion: TrackVersion;
}

export interface TrackComment {
    id: string;
    trackVersionId: string;
    userId: string;
    timestampInSeconds: number;
    content: string;
    parentCommentId?: string;
    createdAt: Date;
    feeling?: CommentFeelingTag;
    trackVersion: TrackVersion;
    author: User;
    parent?: TrackComment;
    replies: TrackComment[];
    conflicts: Conflict[];
}

export interface Conflict {
    id: string;
    projectId: string;
    status: ConflictStatus;
    initialReason?: string;
    reportedById: string;
    createdAt: Date;
    updatedAt: Date;
    project: Project;
    reporter: User;
    conflictingComments: TrackComment[];
    resolution?: ConflictResolution;
}

export interface ConflictResolution {
    id: string;
    conflictId: string;
    moderatorId: string;
    resolutionType: ResolutionType;
    resolutionNotes: string;
    resolvedAt: Date;
    conflict: Conflict;
    moderator: User;
}
