"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PanelLeftOpen, Play, Pause, Download, Share2 } from "lucide-react"
import { useState } from "react"

interface ProjectHeaderProps {
  title: string
  version: string
  onToggleSidebar: () => void
}

export function ProjectHeader({ title, version, onToggleSidebar }: ProjectHeaderProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
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
                {version}
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
  )
}
