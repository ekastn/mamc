"use client"

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { cn, getEmotionColor, getEmotionIcon } from "@/lib/utils"
import type { Comment } from "@/lib/types"

interface TimelineCommentMarkersProps {
  comments: Comment[]
  duration: number
  currentTime?: number
  zoom?: number
  active?: boolean
  onCommentClick?: (comment: Comment) => void
  onEditComment?: (comment: Comment) => void
  onDeleteComment?: (commentId: string) => void
}

export function TimelineCommentMarkers({ 
  comments, 
  duration, 
  currentTime = 0,
  zoom = 1, 
  active = true, 
  onCommentClick,
  onEditComment,
  onDeleteComment
}: TimelineCommentMarkersProps) {
  if (!active || duration === 0) return null

  // Format time from seconds to MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      {comments.map((comment) => (
        <ContextMenu key={comment.id}>
          <ContextMenuTrigger>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="absolute top-0 cursor-pointer z-20"
                    style={{
                      left: `${(comment.timePosition / duration) * 100}%`,
                      transform: `translateX(-50%)` // Center the marker
                    }}
                    onClick={() => onCommentClick && onCommentClick(comment)}
                  >
                    <div className="relative">
                      <div className={cn(
                        "h-4 w-4", 
                        getEmotionColor(comment.emotion),
                        comment.hasConflict ? "animate-pulse ring-2 ring-red-500" : ""
                      )}></div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="z-30">
                  <Card className="w-64 border-2 border-black p-0">
                    <CardContent className="p-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-6 w-6 rounded-none">
                          <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                          <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                            {comment.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium uppercase tracking-wide">{comment.user.name}</span>
                            <span className="text-muted-foreground uppercase tracking-wide">
                              at {formatTime(comment.timePosition)}
                            </span>
                          </div>
                          <p>{comment.text}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <span>{getEmotionIcon(comment.emotion)}</span>
                            <span className="uppercase tracking-wide">{comment.emotion}</span>
                          </div>
                          {comment.hasConflict && (
                            <div className="mt-1 p-1 bg-red-50 text-red-600 text-xs">
                              This comment has a conflict that needs resolution
                            </div>
                          )}
                          {(comment.likes || comment.replies) && (
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              {comment.likes ? `${comment.likes} likes` : ""}
                              {comment.likes && comment.replies ? " · " : ""}
                              {comment.replies ? `${comment.replies} replies` : ""}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ContextMenuTrigger>
          <ContextMenuContent className="border-2 border-black">
            <ContextMenuItem 
              className="cursor-pointer uppercase text-xs tracking-wide"
              onClick={() => onEditComment && onEditComment(comment)}
            >
              Edit Comment
            </ContextMenuItem>
            <ContextMenuItem 
              className="cursor-pointer uppercase text-xs tracking-wide text-red-500"
              onClick={() => onDeleteComment && onDeleteComment(comment.id)}
            >
              Delete Comment
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ))}
    </>
  )
}
