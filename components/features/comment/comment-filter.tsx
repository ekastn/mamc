"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { emotionService } from "@/lib/services/client/audio/emotion-service"

interface CommentFilterProps {
  selectedFilters: string[]
  onToggleFilter: (emotion: string) => void
  onClearFilters?: () => void
}

export function CommentFilter({ selectedFilters, onToggleFilter, onClearFilters }: CommentFilterProps) {
  const emotions = emotionService.getAllEmotions()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium uppercase tracking-wide">Filter by emotion:</span>

      {emotions.map((emotion) => {
        const isSelected = selectedFilters.includes(emotion.name.toLowerCase())

        return (
          <Button
            key={emotion.name}
            variant="outline"
            size="sm"
            className={cn(
              "gap-1 border-2 uppercase text-xs tracking-wide rounded-none",
              emotion.borderColor,
              isSelected ? emotion.bgColor : "bg-transparent",
            )}
            onClick={() => onToggleFilter(emotion.name.toLowerCase())}
          >
            <span className={cn("h-3 w-3", emotion.color)}></span>
            {emotion.name}
            {isSelected && <X className="h-3 w-3 ml-1" />}
          </Button>
        )
      })}

      {selectedFilters.length > 0 && onClearFilters && (
        <Button variant="ghost" size="sm" className="uppercase text-xs tracking-wide" onClick={onClearFilters}>
          Clear All
        </Button>
      )}

      {selectedFilters.length > 0 && (
        <Badge variant="secondary" className="uppercase text-xs tracking-wide">
          {selectedFilters.length} filter{selectedFilters.length !== 1 ? "s" : ""} active
        </Badge>
      )}
    </div>
  )
}
