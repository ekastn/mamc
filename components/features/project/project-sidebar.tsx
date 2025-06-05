"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, Music, Tag, Share2, Settings } from "lucide-react"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  project: Project
}

export function ProjectSidebar({ project }: ProjectSidebarProps) {
  return (
    <div className="w-80 border-r border-border bg-muted/30 py-4 space-y-6">
      {/* Project Info */}
      <Card className="border-2 border-black">
        <div className={cn("h-2 w-full", project.color)}></div>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg uppercase tracking-wide">{project.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide">Last updated: {project.lastUpdated}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide">{project.tracks.length} tracks</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wide">{project.collaborators.length} collaborators</span>
          </div>
        </CardContent>
      </Card>

      {/* Collaborators */}
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-base uppercase tracking-wide flex items-center gap-2">
            <Users className="h-4 w-4" />
            Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-none">
                <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                  {collaborator.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium uppercase tracking-wide truncate">{collaborator.name}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{collaborator.role}</p>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "h-3 w-3 p-0 border-2",
                  `border-${collaborator.mood === "happy" ? "[#FFD500]" : collaborator.mood === "frustrated" ? "[#E41E26]" : "black"}`,
                )}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card className="border-2 border-black">
        <CardHeader className="pb-3">
          <CardTitle className="text-base uppercase tracking-wide flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-2 border-black uppercase text-xs tracking-wide">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button className="w-full gap-2 bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide">
          <Share2 className="h-4 w-4" />
          Share Project
        </Button>
        <Button variant="outline" className="w-full gap-2 border-2 border-black uppercase text-xs tracking-wide">
          <Settings className="h-4 w-4" />
          Project Settings
        </Button>
      </div>
    </div>
  )
}
