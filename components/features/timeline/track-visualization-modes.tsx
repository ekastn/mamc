"use client"

import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export type VisualizationMode = "waveform" | "blocks" | "lines" | "none"

interface TrackVisualizationModesProps {
  onChange: (mode: VisualizationMode) => void
  currentMode: VisualizationMode
}

export function TrackVisualizationModes({ onChange, currentMode }: TrackVisualizationModesProps) {
  const visualizationModes = [
    { id: "waveform", label: "Waveform"},
    { id: "blocks", label: "Blocks"},
    { id: "lines", label: "Lines"},
    { id: "none", label: "None"},
  ]

  const currentModeData = visualizationModes.find(mode => mode.id === currentMode) || visualizationModes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="border-2 border-black uppercase text-xs tracking-wide">
          {currentModeData.label}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-2 border-black">
        {visualizationModes.map((mode) => {
          return (
            <DropdownMenuItem 
              key={mode.id} 
              className="uppercase text-xs tracking-wide cursor-pointer flex items-center"
              onClick={() => onChange(mode.id as VisualizationMode)}
            >
              {mode.label}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
