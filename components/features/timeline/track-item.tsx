"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Track } from "@/lib/types"

interface TrackProps {
  track: Track
  isSelected: boolean
  currentTimeSeconds: number
  durationSeconds: number
  zoom: number
  onSelect: (id: string) => void
  onMute?: (id: string, muted: boolean) => void
  onSolo?: (id: string, solo: boolean) => void
  isAudible?: boolean
}

export function TrackItem({
  track,
  isSelected,
  currentTimeSeconds,
  durationSeconds,
  zoom,
  onSelect,
  onMute,
  onSolo,
  isAudible = true,
}: TrackProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isSolo, setIsSolo] = useState(false)

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
    if (onMute) {
      onMute(track.id, !isMuted)
    }
  }

  const handleSoloToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSolo(!isSolo)
    if (onSolo) {
      onSolo(track.id, !isSolo)
    }
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(100, (currentTimeSeconds / durationSeconds) * 100)

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 border-2 transition-all cursor-pointer",
        isSelected ? "border-black" : "border-transparent",
        !isAudible ? "opacity-40" : "opacity-100"
      )}
      onClick={() => onSelect(track.id)}
    >
      <div className="flex items-center justify-between w-20">
        <div className="text-sm font-medium truncate uppercase tracking-wide">{track.name}</div>
        <div className="flex gap-1">
          {onMute && (
            <button
              className={cn(
                "text-xs px-1 rounded",
                isMuted ? "bg-red-100 text-red-800" : "bg-gray-100"
              )}
              onClick={handleMuteToggle}
              title={isMuted ? "Unmute" : "Mute"}
            >
              M
            </button>
          )}
          {onSolo && (
            <button
              className={cn(
                "text-xs px-1 rounded",
                isSolo ? "bg-green-100 text-green-800" : "bg-gray-100"
              )}
              onClick={handleSoloToggle}
              title={isSolo ? "Unsolo" : "Solo"}
            >
              S
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 h-10 bg-gray-100 rounded-none relative overflow-hidden">
        {/* Progress bar only */}
        <div
          className={cn("h-full transition-all", track.color)}
          style={{
            width: `${progressPercentage}%`,
          }}
        ></div>
        {/* Track duration */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-mono">
          {track.duration}
        </div>
      </div>
    </div>
  )
}
