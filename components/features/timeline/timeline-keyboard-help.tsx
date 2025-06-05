"use client"

import { Button } from "@/components/ui/button"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

export function TimelineKeyboardHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="border-2 border-black uppercase text-xs tracking-wide"
        >
          <Keyboard className="h-4 w-4 mr-2" />
          Keyboard Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-black p-0 rounded-none">
        <DialogHeader className="p-4 border-b-2 border-black">
          <DialogTitle className="text-lg uppercase tracking-wide">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Space</div>
            <div className="text-sm">Play/Pause</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + Right Arrow</div>
            <div className="text-sm">Skip Forward 5s</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + Left Arrow</div>
            <div className="text-sm">Skip Backward 5s</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + Up Arrow</div>
            <div className="text-sm">Volume Up</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + Down Arrow</div>
            <div className="text-sm">Volume Down</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + +</div>
            <div className="text-sm">Zoom In</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">Ctrl + -</div>
            <div className="text-sm">Zoom Out</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">M</div>
            <div className="text-sm">Mute Selected Track</div>
            
            <div className="font-mono text-xs bg-gray-100 p-2 text-center rounded">S</div>
            <div className="text-sm">Solo Selected Track</div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Note: On Mac, use Command (⌘) instead of Ctrl
          </p>
        </div>
        <DialogFooter className="p-4 border-t-2 border-black">
          <Button 
            className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide rounded-none"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
