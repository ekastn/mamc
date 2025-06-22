"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { emotionService } from "@/lib/services/client/audio/emotion-service"
import { formatTimeDisplay } from "@/lib/utils/audio-utils"

interface CommentCreatorProps {
  currentTime: number
  onAddComment: (text: string, emotion: string) => void
}

export function CommentCreator({ currentTime, onAddComment }: CommentCreatorProps) {
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  const handleSubmit = () => {
    if (commentText && selectedEmotion) {
      onAddComment(commentText, selectedEmotion)
      setCommentText("")
      setSelectedEmotion(null)
      setShowCommentForm(false)
    }
  }

  // Get emotions from the emotion service
  const emotions = emotionService.getAllEmotions()

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1 border-2 border-black uppercase text-xs tracking-wide"
        onClick={() => setShowCommentForm(true)}
      >
        Add Comment at {formatTimeDisplay(currentTime)}
      </Button>

      <Dialog open={showCommentForm} onOpenChange={setShowCommentForm}>
        <DialogContent className="border-2 border-black rounded-none p-0 w-[350px]">
          <DialogHeader className="p-4 pb-2 border-b-2 border-black">
            <DialogTitle className="uppercase tracking-wide text-base">
              Add Comment at {formatTimeDisplay(currentTime)}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Textarea
              placeholder="ADD YOUR COMMENT HERE..."
              className="border-2 border-black rounded-none min-h-[100px] text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wide font-medium">SELECT EMOTION:</p>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <Button
                    key={emotion.name}
                    type="button"
                    variant="outline"
                    className={cn(
                      "gap-1 border-2 uppercase text-xs tracking-wide rounded-none",
                      emotion.borderColor,
                      selectedEmotion === emotion.name.toLowerCase() ? emotion.bgColor : "bg-transparent",
                    )}
                    onClick={() => setSelectedEmotion(emotion.name.toLowerCase())}
                  >
                    <span className={cn("h-3 w-3", emotion.color)}></span>
                    {emotion.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="border-2 border-black uppercase text-xs tracking-wide"
                onClick={() => setShowCommentForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                onClick={handleSubmit}
                disabled={!commentText || !selectedEmotion}
              >
                Add Comment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
