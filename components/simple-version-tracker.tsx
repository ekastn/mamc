"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Upload, Edit, Tag } from "lucide-react"

interface Version {
  id: string
  version: string
  timestamp: string
  author: string
  description: string
  type: "upload" | "edit" | "comment" | "milestone"
  files?: string[]
  changes?: number
}

interface SimpleVersionTrackerProps {
  projectId: string
  className?: string
}

export function SimpleVersionTracker({ projectId, className }: SimpleVersionTrackerProps) {
  const [versions, setVersions] = useState<Version[]>([])

  // Initialize with some sample versions
  useEffect(() => {
    const sampleVersions: Version[] = [
      {
        id: "1",
        version: "v1.0.0",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        author: "Alex Chen",
        description: "Initial project setup with basic structure",
        type: "milestone",
        files: ["project-config.json", "README.md"],
        changes: 2,
      },
      {
        id: "2",
        version: "v1.1.0",
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        author: "Sarah Kim",
        description: "Added main audio track and vocals",
        type: "upload",
        files: ["main-track.mp3", "vocals.wav"],
        changes: 2,
      },
      {
        id: "3",
        version: "v1.1.1",
        timestamp: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
        author: "Mike Johnson",
        description: "Updated mixing levels and added effects",
        type: "edit",
        changes: 3,
      },
      {
        id: "4",
        version: "v1.2.0",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        author: "Alex Chen",
        description: "Added drum track and bass line",
        type: "upload",
        files: ["drums.wav", "bass.mp3"],
        changes: 2,
      },
    ]
    setVersions(sampleVersions)
  }, [projectId])

  const addVersion = (description: string, type: Version["type"], files?: string[]) => {
    const newVersion: Version = {
      id: Date.now().toString(),
      version: `v1.${versions.length}.0`,
      timestamp: new Date().toISOString(),
      author: "Current User",
      description,
      type,
      files,
      changes: files?.length || 1,
    }

    setVersions((prev) => [newVersion, ...prev])
  }

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

  const getTypeIcon = (type: Version["type"]) => {
    switch (type) {
      case "upload":
        return <Upload className="h-4 w-4" />
      case "edit":
        return <Edit className="h-4 w-4" />
      case "milestone":
        return <Tag className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Version["type"]) => {
    switch (type) {
      case "upload":
        return "bg-[#1C3F95] text-white"
      case "edit":
        return "bg-[#E31E24] text-white"
      case "milestone":
        return "bg-[#F39C12] text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  // Expose addVersion function for parent components
  useEffect(() => {
    // This could be used by parent components to add versions
    ;(window as any).addProjectVersion = addVersion

    return () => {
      delete (window as any).addProjectVersion
    }
  }, [versions.length])

  return (
    <Card className={`border-2 border-black ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg uppercase tracking-wide flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {versions.length === 0 ? (
          <p className="text-sm text-muted-foreground uppercase tracking-wide text-center py-4">No versions yet</p>
        ) : (
          versions.map((version, index) => (
            <div key={version.id} className="border border-black p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`${getTypeColor(version.type)} rounded-none uppercase text-xs tracking-wide`}>
                    {getTypeIcon(version.type)}
                    {version.type}
                  </Badge>
                  <span className="text-sm font-medium uppercase tracking-wide">{version.version}</span>
                </div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {formatTimestamp(version.timestamp)}
                </span>
              </div>

              <p className="text-sm mb-2 uppercase tracking-wide">{version.description}</p>

              <div className="flex items-center justify-between text-xs text-muted-foreground uppercase tracking-wide">
                <span>By {version.author}</span>
                <div className="flex items-center gap-3">
                  {version.files && (
                    <span>
                      {version.files.length} file{version.files.length > 1 ? "s" : ""}
                    </span>
                  )}
                  {version.changes && (
                    <span>
                      {version.changes} change{version.changes > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {version.files && version.files.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Files:</p>
                  <div className="flex flex-wrap gap-1">
                    {version.files.map((file, fileIndex) => (
                      <Badge key={fileIndex} variant="outline" className="text-xs rounded-none">
                        {file}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {index === 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <Badge className="bg-green-600 text-white rounded-none uppercase text-xs tracking-wide">
                    Current Version
                  </Badge>
                </div>
              )}
            </div>
          ))
        )}

        <div className="pt-2 border-t border-black">
          <Button
            variant="outline"
            size="sm"
            onClick={() => addVersion("Manual checkpoint created", "milestone")}
            className="w-full border-2 border-black uppercase text-xs tracking-wide"
          >
            Create Checkpoint
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
