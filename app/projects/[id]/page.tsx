"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline } from "@/components/features/timeline/timeline"
import { CommentList } from "@/components/comment-list"
import { VersionTracker } from "@/components/version-history"
import { ProjectSidebar } from "@/components/features/project/project-sidebar"
import { ProjectHeader } from "@/components/features/project/project-header"
import { ProjectCommentForm } from "@/components/features/project/project-comment-form"
import { projectService } from "@/lib/services/client/project-service"
import type { Project } from "@/lib/types/project"

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [showSidebar, setShowSidebar] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch project data
  useEffect(() => {
    try {
      const projectData = projectService.getProjectById(params.id)
      setProject(projectData)
    } catch (error) {
      console.error("Error fetching project:", error)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  // Handle toggle sidebar
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // Handle comment submission
  const handleCommentSubmit = (text: string, emotion?: string) => {
    if (project) {
      projectService.addComment(project.id, {
        position: Math.random() * 100,
        timePosition: Math.random() * 200,
        user: project.collaborators[0], // Use first collaborator as current user
        text,
        emotion: (emotion as any) || "neutral",
        timestamp: new Date().toISOString(),
      })
    }
  }

  if (loading) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Loading project...</div>
  }

  if (!project) {
    return <div className="flex h-[calc(100vh-4rem)] items-center justify-center">Project not found</div>
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {showSidebar && <ProjectSidebar project={project} />}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ProjectHeader
          title={project.title}
          version={project.version || "v1.0"}
          onToggleSidebar={handleToggleSidebar}
          currentCheckpointLabel={
            project.currentCheckpointId && project.checkpoints
              ? project.checkpoints.find(cp => cp.id === project.currentCheckpointId)?.label
              : undefined
          }
          project={project}
          onUploadComplete={(trackId, audioUrl, changes) => {
            // Determine if this is a new track or an existing one
            const isNewTrack = !project.tracks.some(track => track.id === trackId);
            const trackName = isNewTrack ? `New Track ${project.tracks.length + 1}` : "";

            // Call the service to handle the upload
            const success = projectService.uploadTrackVersion(
              project.id,
              trackId,
              audioUrl,
              changes,
              isNewTrack,
              trackName
            );

            if (success) {
              // Refresh the project data
              setProject(projectService.getProjectById(project.id));
            } else {
              console.error("Failed to upload track version");
              // In a real app, you would show an error notification
            }
          }}
        />

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="timeline" className="h-full flex flex-col">
            <div className="border-b px-4">
              <TabsList className="justify-start border-2 border-black p-0 h-auto">
                <TabsTrigger
                  value="timeline"
                  className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Timeline
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Comments
                </TabsTrigger>
                <TabsTrigger
                  value="versions"
                  className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Versions
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="timeline" className="flex-1 p-4 overflow-auto">
              <Timeline />
            </TabsContent>

            <TabsContent value="comments" className="flex-1 p-4 overflow-auto">
              <CommentList />
            </TabsContent>

            <TabsContent value="versions" className="flex-1 p-4 overflow-auto">
              <VersionTracker
                project={project}
                onCreateCheckpoint={(name, label, description) => {
                  // Create a new checkpoint using the projectService with label and description
                  const success = projectService.createCheckpoint(project.id, name, label, description);
                  if (success) {
                    // Refresh the project data
                    setProject(projectService.getProjectById(project.id));
                  } else {
                    console.error("Failed to create checkpoint");
                    // In a real app, you would show an error notification
                  }
                }}
                onApplyCheckpoint={(checkpointId) => {
                  // Apply an existing checkpoint using the projectService
                  const success = projectService.applyCheckpoint(project.id, checkpointId);
                  if (success) {
                    // Refresh the project data
                    setProject(projectService.getProjectById(project.id));
                  } else {
                    console.error("Failed to apply checkpoint");
                    // In a real app, you would show an error notification
                  }
                }}
              />
            </TabsContent>
          </Tabs>
        </div>

        <ProjectCommentForm onSubmit={handleCommentSubmit} />
      </div>
    </div>
  )
}
