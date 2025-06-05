"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter, Flag, Heart, MessageSquare, MoreHorizontal, Search, ThumbsDown, ThumbsUp } from "lucide-react"
import { cn, getEmotionColor, getEmotionIcon } from "@/lib/utils"
import { SAMPLE_COMMENTS } from "@/lib/constants"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function CommentList() {
  const [filter, setFilter] = useState("all")
  const comments = SAMPLE_COMMENTS

  const filteredComments =
    filter === "all"
      ? comments
      : filter === "conflicts"
        ? comments.filter((c) => c.hasConflict)
        : comments.filter((c) => c.emotion === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="SEARCH COMMENTS..."
            className="pl-8 border-2 border-black uppercase text-xs"
          />
        </div>
        <Button variant="outline" className="gap-2 border-2 border-black uppercase text-xs tracking-wide">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 border-2 border-black p-0 h-auto">
          <TabsTrigger
            value="all"
            className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
          >
            All Comments
          </TabsTrigger>
          <TabsTrigger
            value="happy"
            className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Happy
          </TabsTrigger>
          <TabsTrigger
            value="frustrated"
            className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Frustrated
          </TabsTrigger>
          <TabsTrigger
            value="conflicts"
            className="uppercase text-xs tracking-wide py-2 rounded-none data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Conflicts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-4 space-y-4">
          {filteredComments.map((comment) => (
            <Card key={comment.id} className={cn("border-2 border-black", comment.hasConflict && "border-[#E41E26]")}>
              <CardHeader className="p-4 pb-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="rounded-none">
                        <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                        <AvatarFallback className="rounded-none bg-[#1C3F95] text-white">
                          {comment.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "absolute -bottom-1 -right-1 h-4 w-4 border-2 border-background",
                          getEmotionColor(comment.user.mood),
                        )}
                      ></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base uppercase tracking-wide">{comment.user.name}</CardTitle>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Track: Main Beat, {comment.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {comment.hasConflict && (
                      <Badge
                        variant="destructive"
                        className="gap-1 bg-[#E41E26] uppercase text-xs tracking-wide rounded-none"
                      >
                        <Flag className="h-3 w-3" />
                        Conflict
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-2 border-black rounded-none">
                        <DropdownMenuItem className="uppercase text-xs tracking-wide">Copy link</DropdownMenuItem>
                        <DropdownMenuItem className="uppercase text-xs tracking-wide">
                          Mark as resolved
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[#E41E26] uppercase text-xs tracking-wide">
                          <Flag className="h-4 w-4 mr-2" />
                          Report comment
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <p className="mb-3">{comment.text}</p>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Badge
                      variant="secondary"
                      className="gap-1 h-6 rounded-none border border-black bg-white text-black uppercase text-xs tracking-wide"
                    >
                      <span>{getEmotionIcon(comment.emotion)}</span>
                      <span className="uppercase">{comment.emotion}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 ml-auto">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 uppercase text-xs tracking-wide">
                      <Heart className="h-4 w-4" />
                      <span>{comment.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 uppercase text-xs tracking-wide">
                      <MessageSquare className="h-4 w-4" />
                      <span>{comment.replies}</span>
                    </Button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {comment.hasConflict && (
                  <div className="mt-3 pt-3 border-t border-[#E41E26]">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Flag className="h-4 w-4 text-[#E41E26]" />
                      <span className="uppercase text-xs tracking-wide">
                        This comment has conflicting feedback. A moderator has been notified.
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
