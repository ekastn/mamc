"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelLeftOpen, Play, Pause, Download, Share2, Upload } from "lucide-react"
import { useState } from "react"
import { TrackUploadDialog } from "./track-upload-dialog"
import type { Project } from "@/lib/types/index"

interface ProjectHeaderProps {
  title: string
  version: string
  onToggleSidebar: () => void
  currentCheckpointLabel?: string
  project: Project
  onUploadComplete?: (trackId: string, audioUrl: string, changes: string[]) => void
}

export function ProjectHeader({ 
  title, 
  version, 
  onToggleSidebar, 
  currentCheckpointLabel,
  project,
  onUploadComplete
}: ProjectHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  return (
    <>
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="border-2 border-black">
              <PanelLeftOpen className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wide">{title}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
                  {currentCheckpointLabel || version}
                </Badge>
                <span className="text-sm text-muted-foreground uppercase tracking-wide">Current Version</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="border-2 border-black"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              className="gap-2 border-2 border-black uppercase text-xs tracking-wide"
              onClick={() => setShowUploadDialog(true)}
            >
              <Upload className="h-4 w-4" />
              Upload Track
            </Button>
            <Button variant="outline" className="gap-2 border-2 border-black uppercase text-xs tracking-wide">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Track Upload Dialog */}
      <TrackUploadDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        project={project}
        onUploadComplete={onUploadComplete}
      />
    </>
  )
}
