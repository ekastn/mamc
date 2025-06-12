"use client"

import { useParams } from 'next/navigation'
import { Timeline as TimelineComponent } from "@/components/timeline"
import { useEffect, useState } from 'react'
import { projectService } from '@/services/project-service'
import type { ProjectTrack as Track, Comment } from '@/lib/types'

export function Timeline() {
  const params = useParams()
  const projectId = params?.id as string
  
  const [tracks, setTracks] = useState<Track[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true)
        if (projectId) {
          const project = projectService.getProjectById(projectId)
          const projectComments = projectService.getProjectComments(projectId)
          
          if (project) {
            setTracks(project.tracks)
            setComments(projectComments)
          }
        }
      } catch (error) {
        console.error('Error fetching timeline data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId])

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading timeline...</div>
  }

  return <TimelineComponent projectId={projectId} tracks={tracks} comments={comments} />
}
