"use client"

import { useState, useEffect } from "react"
import { Bell, X, Check, User, Music, MessageSquare, Clock, Info } from "lucide-react"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: "mention" | "comment" | "collaboration" | "version" | "emotional" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  user?: {
    id: string
    name: string
    avatar?: string
  }
  projectId?: string
  projectTitle?: string
}

export interface Suggestion {
  id: string
  type: "collaboration" | "version" | "emotional" | "conflict"
  title: string
  message: string
  actionLabel: string
  actionUrl: string
  importance: "low" | "medium" | "high"
}

interface NotificationCenterProps {
  notifications?: Notification[]
  suggestions?: Suggestion[]
  onNotificationRead?: (id: string) => void
  onAllNotificationsRead?: () => void
  onNotificationRemove?: (id: string) => void
}

export function NotificationCenter({
  notifications = [],
  suggestions = [],
  onNotificationRead,
  onAllNotificationsRead,
  onNotificationRemove,
}: NotificationCenterProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("all")

  useEffect(() => {
    // Count unread notifications
    setUnreadCount(notifications.filter(notification => !notification.read).length)
  }, [notifications])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }

  const handleMarkAsRead = (id: string) => {
    onNotificationRead?.(id)
  }

  const handleMarkAllAsRead = () => {
    onAllNotificationsRead?.()
  }

  const handleRemove = (id: string) => {
    onNotificationRemove?.(id)
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.read
    return notification.type === activeTab
  })

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "mention":
        return <User className="h-4 w-4 text-blue-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "collaboration":
        return <User className="h-4 w-4 text-purple-500" />
      case "version":
        return <Music className="h-4 w-4 text-orange-500" />
      case "emotional":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "system":
        return <Info className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getSuggestionIcon = (type: Suggestion["type"]) => {
    switch (type) {
      case "collaboration":
        return <User className="h-4 w-4 text-purple-500" />
      case "version":
        return <Music className="h-4 w-4 text-orange-500" />
      case "emotional":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "conflict":
        return <Info className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-2 border-black rounded-none">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-[#E41E26] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[380px] p-0 border-2 border-black" 
        align="end"
        sideOffset={5}
      >
        <div className="p-3 border-b-2 border-black flex items-center justify-between">
          <h3 className="text-sm font-medium uppercase tracking-wide">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              className="text-xs uppercase tracking-wide hover:bg-transparent hover:text-blue-500"
            >
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 border-b-2 border-black p-0 h-auto rounded-none">
            <TabsTrigger 
              value="all" 
              className="uppercase text-xs tracking-wide py-2 rounded-none"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="uppercase text-xs tracking-wide py-2 rounded-none"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="mention" 
              className="uppercase text-xs tracking-wide py-2 rounded-none"
            >
              Mentions
            </TabsTrigger>
            <TabsTrigger 
              value="comment" 
              className="uppercase text-xs tracking-wide py-2 rounded-none"
            >
              Comments
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="max-h-[300px] overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  No notifications
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={cn(
                      "p-3 flex gap-3 hover:bg-muted transition-colors",
                      !notification.read && "bg-blue-50 dark:bg-blue-950/20"
                    )}
                  >
                    {notification.user ? (
                      <Avatar className="h-8 w-8 rounded-none">
                        <AvatarImage src={notification.user.avatar} />
                        <AvatarFallback className="bg-black text-white rounded-none">
                          {notification.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-none bg-muted flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {notification.timestamp}
                        </span>
                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            asChild
                          >
                            <a href={notification.actionUrl}>View</a>
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemove(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {suggestions.length > 0 && (
          <>
            <div className="p-3 border-t-2 border-black">
              <h3 className="text-sm font-medium uppercase tracking-wide">Suggestions</h3>
            </div>
            <div className="max-h-[150px] overflow-y-auto divide-y">
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-3 flex gap-3 hover:bg-muted transition-colors">
                  <div className={cn(
                    "h-8 w-8 rounded-none flex items-center justify-center",
                    suggestion.importance === "high" ? "bg-red-100" :
                    suggestion.importance === "medium" ? "bg-orange-100" : "bg-blue-100"
                  )}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 h-7 border-2 border-black rounded-none text-xs uppercase tracking-wide"
                      asChild
                    >
                      <a href={suggestion.actionUrl}>{suggestion.actionLabel}</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
