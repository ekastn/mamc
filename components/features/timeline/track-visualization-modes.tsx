"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown, WaveformIcon, BarChart3, LineChart } from "lucide-react"

export type VisualizationMode = "waveform" | "blocks" | "lines" | "none"

interface TrackVisualizationModesProps {
  onChange: (mode: VisualizationMode) => void
  currentMode: VisualizationMode
}

export function TrackVisualizationModes({ onChange, currentMode }: TrackVisualizationModesProps) {
  const visualizationModes = [
    { id: "waveform", label: "Waveform", icon: WaveformIcon },
    { id: "blocks", label: "Blocks", icon: BarChart3 },
    { id: "lines", label: "Lines", icon: LineChart },
    { id: "none", label: "None", icon: null },
  ]

  const currentModeData = visualizationModes.find(mode => mode.id === currentMode) || visualizationModes[0]
  const CurrentIcon = currentModeData.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 border-black uppercase text-xs tracking-wide">
          {CurrentIcon && <CurrentIcon className="h-4 w-4 mr-2" />}
          {currentModeData.label}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-black">
        {visualizationModes.map((mode) => {
          const Icon = mode.icon
          return (
            <DropdownMenuItem 
              key={mode.id} 
              className="uppercase text-xs tracking-wide cursor-pointer flex items-center"
              onClick={() => onChange(mode.id as VisualizationMode)}
            >
              {Icon && <Icon className="h-4 w-4 mr-2" />}
              {mode.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
