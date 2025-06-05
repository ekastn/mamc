"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Track } from "@/lib/types"
import type { VisualizationMode } from "@/components/features/timeline/track-visualization-modes"

interface TrackProps {
  track: Track
  isSelected: boolean
  currentTimeSeconds: number
  durationSeconds: number
  zoom: number
  visualizationMode: VisualizationMode
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
  visualizationMode,
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

  // Render appropriate visualization based on mode
  const renderVisualization = () => {
    switch (visualizationMode) {
      case 'waveform':
        return (
          <div 
            className="absolute inset-0 waveform-pattern opacity-30"
            style={{
              transformOrigin: 'left',
              transform: `scaleX(${zoom})`
            }}
          />
        )
      case 'blocks':
        return (
          <div className="absolute inset-0 flex items-center overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "h-8 mx-px transition-all",
                  i / 50 <= progressPercentage / 100 ? track.color : "bg-gray-200"
                )}
                style={{ 
                  width: `${2 * zoom}%`,
                  height: `${30 + Math.random() * 70}%`
                }}
              />
            ))}
          </div>
        )
      case 'lines':
        return (
          <div className="absolute inset-0" style={{ overflow: 'hidden' }}>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
              <defs>
                <linearGradient id={`trackGradient-${track.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={track.color.replace('bg-', '').replace('[', '').replace(']', '')} />
                  <stop offset="100%" stopColor="#f0f0f0" />
                </linearGradient>
                <clipPath id={`trackClip-${track.id}`}>
                  <rect x="0" y="0" width={progressPercentage} height="100" />
                </clipPath>
              </defs>
              
              {/* Create a random line pattern */}
              <path 
                d={generateRandomPath()} 
                fill="none" 
                stroke="#e0e0e0" 
                strokeWidth="2"
              />
              
              {/* Same path but clipped to show progress */}
              <path 
                d={generateRandomPath()} 
                fill="none" 
                stroke={track.color.replace('bg-', '').replace('[', '').replace(']', '')} 
                strokeWidth="2"
                clipPath={`url(#trackClip-${track.id})`}
              />
            </svg>
          </div>
        )
      case 'none':
      default:
        return null
    }
  }
  
  // Generate a random path for the line visualization
  const generateRandomPath = () => {
    const points = 10;
    let path = `M 0 50`;
    
    for (let i = 1; i <= points; i++) {
      const x = (i / points) * 100;
      const y = 20 + Math.random() * 60; // Random value between 20 and 80
      path += ` L ${x} ${y}`;
    }
    
    return path;
  }

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
        {/* Progress bar */}
        <div
          className={cn("h-full transition-all", track.color)}
          style={{
            width: `${progressPercentage}%`,
          }}
        ></div>

        {/* Visualization */}
        {renderVisualization()}

        {/* Track duration */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-mono">
          {track.duration}
        </div>
      </div>
    </div>
  )
}
