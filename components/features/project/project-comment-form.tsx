"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Send, Smile, Frown, Meh, Angry } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCommentFormProps {
  onSubmit: (text: string, emotion?: string) => void
}

export function ProjectCommentForm({ onSubmit }: ProjectCommentFormProps) {
  const [comment, setComment] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState<string>("neutral")

  const emotions = [
    { id: "happy", label: "Happy", icon: Smile, color: "bg-[#FFD500]" },
    { id: "neutral", label: "Neutral", icon: Meh, color: "bg-black" },
    { id: "frustrated", label: "Frustrated", icon: Angry, color: "bg-[#E41E26]" },
    { id: "sad", label: "Sad", icon: Frown, color: "bg-[#1C3F95]" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (comment.trim()) {
      onSubmit(comment, selectedEmotion)
      setComment("")
      setSelectedEmotion("neutral")
    }
  }

  return (
    <div className="border-t border-border p-4 bg-background">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium uppercase tracking-wide">How are you feeling?</span>
          <div className="flex gap-1">
            {emotions.map((emotion) => {
              const Icon = emotion.icon
              return (
                <Button
                  key={emotion.id}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEmotion(emotion.id)}
                  className={cn(
                    "h-8 w-8 p-0 border-2",
                    selectedEmotion === emotion.id ? "border-black bg-muted" : "border-transparent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              )
            })}
          </div>
          <Badge
            variant="outline"
            className={cn(
              "border-2 uppercase text-xs tracking-wide",
              emotions.find((e) => e.id === selectedEmotion)?.color.replace("bg-", "border-") || "border-black",
            )}
          >
            {emotions.find((e) => e.id === selectedEmotion)?.label}
          </Badge>
        </div>

        <div className="flex gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment about this project..."
            className="flex-1 border-2 border-black resize-none"
            rows={2}
          />
          <Button
            type="submit"
            disabled={!comment.trim()}
            className="bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
