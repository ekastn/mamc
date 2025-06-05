"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { EmotionSelector } from "@/components/emotion-selector"

interface TimelineCommentCreatorProps {
  currentTime: number
  formatTime: (seconds: number) => string
  onAddComment: (text: string, emotion: string) => void
  onCancel: () => void
}

export function TimelineCommentCreator({
  currentTime,
  formatTime,
  onAddComment,
  onCancel
}: TimelineCommentCreatorProps) {
  const [commentText, setCommentText] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)
  const [open, setOpen] = useState(true)

  const handleAddComment = () => {
    if (commentText.trim() && selectedEmotion) {
      onAddComment(commentText, selectedEmotion)
      setCommentText("")
      setSelectedEmotion(null)
      setOpen(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  const handleSelectEmotion = (emotion: any) => {
    setSelectedEmotion(emotion.name.toLowerCase())
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-2 border-black p-0 rounded-none">
        <Card className="border-0 shadow-none">
          <CardHeader className="p-4 pb-2 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base uppercase tracking-wide">
                Add Comment at {formatTime(currentTime)}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Textarea
              placeholder="What's on your mind about this section?"
              className="border-2 border-black rounded-none resize-none h-24"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wide">How are you feeling?</p>
              <EmotionSelector
                onSelect={handleSelectEmotion}
                selectedEmotion={selectedEmotion}
                compact={true}
              />
            </div>
          </CardContent>
          <CardFooter className="p-4 border-t-2 border-black flex justify-end space-x-2">
            <Button 
              variant="outline" 
              className="border-2 border-black uppercase text-xs tracking-wide rounded-none"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide rounded-none"
              onClick={handleAddComment}
              disabled={!commentText.trim() || !selectedEmotion}
            >
              Add Comment
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
