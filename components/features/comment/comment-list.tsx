"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit3, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AudioComment } from "@/lib/types/audio"
import { emotionService } from "@/lib/services/client/audio/emotion-service"
import { useComments } from "@/context/comment-context"

interface CommentListProps {
  comments: AudioComment[]
  onCommentClick?: (comment: AudioComment) => void
  emptyMessage?: string
  showActions?: boolean
}

export function CommentList({
  comments,
  onCommentClick,
  emptyMessage = "No comments yet",
  showActions = true,
}: CommentListProps) {
  const { removeComment } = useComments()
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set())

  const toggleExpanded = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(commentId)) {
        newSet.delete(commentId)
      } else {
        newSet.add(commentId)
      }
      return newSet
    })
  }

  const handleDelete = (commentId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    if (window.confirm("Are you sure you want to delete this comment?")) {
      removeComment(commentId)
    }
  }

  const handleEdit = (comment: AudioComment, event: React.MouseEvent) => {
    event.stopPropagation()
    // TODO: Implement edit functionality
    alert("Edit functionality would be implemented here")
  }

  if (comments.length === 0) {
    return (
      <Card className="border-2 border-black">
        <CardContent className="p-8 text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground uppercase tracking-wide">{emptyMessage}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => {
        const isExpanded = expandedComments.has(comment.id)
        const emotionData = emotionService.getEmotionData(comment.emotion)

        return (
          <Card
            key={comment.id}
            className={cn(
              "border-2 border-black cursor-pointer transition-colors hover:bg-muted/50",
              onCommentClick && "hover:border-[#E41E26]",
            )}
            onClick={() => onCommentClick?.(comment)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8 rounded-none">
                  <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                  <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                    {comment.user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm uppercase tracking-wide">{comment.user.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 border-2 uppercase text-xs tracking-wide rounded-none",
                          emotionData.borderColor,
                          emotionData.bgColor,
                        )}
                      >
                        <span className={cn("h-2 w-2", emotionData.color)}></span>
                        {emotionData.name}
                      </Badge>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        at {comment.timestamp}
                      </span>
                    </div>

                    {showActions && (
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEdit(comment, e)}>
                          <Edit3 className="h-3 w-3" />
                          <span className="sr-only">Edit comment</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:text-destructive"
                          onClick={(e) => handleDelete(comment.id, e)}
                        >
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Delete comment</span>
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="text-sm">
                    {comment.text.length > 100 && !isExpanded ? (
                      <>
                        {comment.text.substring(0, 100)}...
                        <Button
                          variant="link"
                          className="p-0 h-auto text-xs uppercase tracking-wide"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpanded(comment.id)
                          }}
                        >
                          Show More
                        </Button>
                      </>
                    ) : (
                      <>
                        {comment.text}
                        {comment.text.length > 100 && (
                          <Button
                            variant="link"
                            className="p-0 h-auto text-xs uppercase tracking-wide ml-2"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleExpanded(comment.id)
                            }}
                          >
                            Show Less
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
