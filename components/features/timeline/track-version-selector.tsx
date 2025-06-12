"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Clock } from "lucide-react"
import { ProjectTrack, TrackVersion } from "@/lib/types/project"

interface TrackVersionSelectorProps {
  track: ProjectTrack
  onVersionSelect: (versionId: string) => void
}

export function TrackVersionSelector({ track, onVersionSelect }: TrackVersionSelectorProps) {
  if (!track || !track.versions) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
        disabled
      >
        <Clock className="h-4 w-4" />
        No Versions
        <ChevronDown className="h-4 w-4" />
      </Button>
    )
  }

  const currentVersion = track.versions.find(v => v.id === track.currentVersionId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
        >
          <Clock className="h-4 w-4" />
          {currentVersion?.number || 'No Version'}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 border-2 border-black">
        {track.versions.length === 0 ? (
          <DropdownMenuItem disabled className="uppercase text-xs tracking-wide text-muted-foreground">
            No versions available
          </DropdownMenuItem>
        ) : (
          track.versions.map((version) => (
            <DropdownMenuItem
              key={version.id}
              className="uppercase text-xs tracking-wide"
              onClick={() => onVersionSelect(version.id)}
            >
              {version.number} - {new Date(version.timestamp).toLocaleDateString()}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
