"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Timeline } from "@/components/features/timeline/timeline"
import { CommentList } from "@/components/comment-list"
import { VersionHistory } from "@/components/version-history"
import { ProjectSidebar } from "@/components/features/project/project-sidebar"
import { ProjectHeader } from "@/components/features/project/project-header"
import { ProjectCommentForm } from "@/components/features/project/project-comment-form"
import { SimpleFileUpload } from "@/components/simple-file-upload"
import { SimpleVersionTracker } from "@/components/simple-version-tracker"
import { projectService } from "@/services/project-service"
import type { Project } from "@/lib/types"

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
        <ProjectHeader title={project.title} version={project.version} onToggleSidebar={handleToggleSidebar} />

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
                <TabsTrigger
                  value="files"
                  className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  Files
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
              <VersionHistory />
            </TabsContent>

            <TabsContent value="files" className="flex-1 p-4 overflow-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium uppercase tracking-wide mb-4">Upload Files</h3>
                  <SimpleFileUpload
                    projectId={params.id}
                    onUploadComplete={(files) => {
                      console.log("Files uploaded:", files)
                      // Add version when files are uploaded
                      if ((window as any).addProjectVersion) {
                        ;(window as any).addProjectVersion(
                          `Uploaded ${files.length} file${files.length > 1 ? "s" : ""}`,
                          "upload",
                          files.map((f) => f.name),
                        )
                      }
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium uppercase tracking-wide mb-4">Version History</h3>
                  <SimpleVersionTracker projectId={params.id} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <ProjectCommentForm onSubmit={handleCommentSubmit} />
      </div>
    </div>
  )
}
