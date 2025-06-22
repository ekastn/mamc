"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Tag, X } from "lucide-react"
import { Project, Checkpoint } from "@/lib/types/project"
import { versionService } from "@/lib/services/client/project/version-service"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VersionTrackerProps {
  project: Project
  onCreateCheckpoint: (name: string, label?: string, description?: string) => void
  onApplyCheckpoint: (checkpointId: string) => void
  className?: string
}

export function VersionTracker({ project, onCreateCheckpoint, onApplyCheckpoint, className }: VersionTrackerProps) {
  const [selectedCheckpoint, setSelectedCheckpoint] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [checkpointName, setCheckpointName] = useState(`Checkpoint ${project.checkpoints.length + 1}`)
  const [checkpointLabel, setCheckpointLabel] = useState(`v${project.checkpoints.length + 1}.0`)
  const [checkpointDescription, setCheckpointDescription] = useState("")

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  // Get track version numbers for a checkpoint
  const getTrackVersionsInfo = (checkpoint: Checkpoint): string[] => {
    try {
      if (!project || !project.tracks || !checkpoint) {
        return ['No track data available']
      }
      
      return project.tracks.map(track => {
        try {
          const versionId = checkpoint.trackVersions[track.id]
          const version = versionService.getTrackVersion(track, versionId)
          return `${track.name}: ${version?.number || 'N/A'}`
        } catch (error) {
          console.error(`Error getting version for track ${track.id}:`, error)
          return `${track.name}: Error`
        }
      })
    } catch (error) {
      console.error("Error getting track versions info:", error)
      return ['Error loading track versions']
    }
  }

  return (
    <>
      <Card className={cn("border-2 border-black", className)}>
        <CardHeader>
          <CardTitle className="text-lg uppercase tracking-wide flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Project Checkpoints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {project.checkpoints.length === 0 ? (
            <p className="text-sm text-muted-foreground uppercase tracking-wide text-center py-4">
              No checkpoints yet
            </p>
          ) : (
            project.checkpoints.map((checkpoint) => (
              <div
                key={checkpoint.id}
                className={cn(
                  "border-2 p-3",
                  project.currentCheckpointId === checkpoint.id
                    ? "border-black bg-muted/50"
                    : "border-gray-300 hover:border-black",
                  selectedCheckpoint === checkpoint.id && "ring-2 ring-black ring-offset-2"
                )}
                onClick={() => setSelectedCheckpoint(
                  selectedCheckpoint === checkpoint.id ? null : checkpoint.id
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[#F39C12] text-white rounded-none uppercase text-xs tracking-wide">
                      <Tag className="h-4 w-4" />
                      Checkpoint
                    </Badge>
                    <span className="text-sm font-medium uppercase tracking-wide">
                      {checkpoint.label}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {formatTimestamp(checkpoint.timestamp)}
                  </span>
                </div>

                <p className="text-sm mb-2 uppercase tracking-wide">{checkpoint.name}</p>
                
                {checkpoint.description && (
                  <p className="text-xs text-muted-foreground mb-2">{checkpoint.description}</p>
                )}

                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Track Versions:
                  </p>
                  {getTrackVersionsInfo(checkpoint).map((info, i) => (
                    <Badge
                      key={i}
                      variant="outline"
                      className="text-xs rounded-none block w-full"
                    >
                      {info}
                    </Badge>
                  ))}
                </div>

                {selectedCheckpoint === checkpoint.id && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        try {
                          e.stopPropagation()
                          onApplyCheckpoint(checkpoint.id)
                          setSelectedCheckpoint(null)
                        } catch (error) {
                          console.error("Error applying checkpoint:", error)
                          // Could add toast notification here in the future
                        }
                      }}
                      className="w-full border-2 border-black uppercase text-xs tracking-wide"
                    >
                      Apply Checkpoint
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}

          <div className="pt-2 border-t border-black">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="w-full gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
            >
              <CheckCircle className="h-4 w-4" />
              Create Checkpoint
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-lg uppercase tracking-wide">Create New Checkpoint</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Checkpoint Name</Label>
              <Input 
                id="name" 
                value={checkpointName} 
                onChange={(e) => setCheckpointName(e.target.value)}
                className="border-2 border-black"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="label">Version Label</Label>
              <Input 
                id="label" 
                value={checkpointLabel} 
                onChange={(e) => setCheckpointLabel(e.target.value)}
                className="border-2 border-black"
                placeholder="e.g. v1.0, v2.1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={checkpointDescription} 
                onChange={(e) => setCheckpointDescription(e.target.value)}
                className="border-2 border-black resize-none"
                placeholder="Describe the changes in this checkpoint"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)} 
              className="border-2 border-black uppercase text-xs tracking-wide"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                try {
                  onCreateCheckpoint(
                    checkpointName, 
                    checkpointLabel, 
                    checkpointDescription
                  );
                  setIsCreateDialogOpen(false);
                  // Reset form fields for next time
                  setCheckpointName(`Checkpoint ${project.checkpoints.length + 2}`);
                  setCheckpointLabel(`v${project.checkpoints.length + 2}.0`);
                  setCheckpointDescription("");
                } catch (error) {
                  console.error("Error creating checkpoint:", error);
                  // Could add toast notification here in the future
                }
              }}
              className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
