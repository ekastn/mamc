"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bell, 
  LogOut, 
  Home, 
  Music, 
  BarChart3, 
  Users, 
  User, 
  Settings, 
  Shield
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { NotificationCenter } from "@/components/notification-center"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_ITEMS = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Music },
  { name: "Collaborators", href: "/collaborators", icon: Users },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Moderation", href: "/moderation", icon: Shield },
]

export default function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState(3)

  const clearNotifications = () => {
    setNotifications(0)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center">
        <div className="mr-6 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold tracking-wide text-lg">HARMONIC</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center space-x-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "default" : "ghost"}
                asChild
                size="sm"
                className={isActive ? "bg-black text-white hover:bg-black/90" : ""}
              >
                <Link href={item.href} className="flex items-center space-x-1">
                  <Icon className="h-4 w-4" />
                  <span className="uppercase text-xs tracking-wide">{item.name}</span>
                </Link>
              </Button>
            )
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <NotificationCenter 
            notifications={[
              {
                id: "1",
                type: "comment",
                title: "New comment on Summer Vibes EP",
                message: "Maria Rodriguez commented on your track",
                timestamp: "2 minutes ago",
                read: false,
                user: {
                  id: "user-2",
                  name: "Maria Rodriguez",
                  avatar: "/placeholder-user.jpg"
                },
                projectId: "project-1",
                projectTitle: "Summer Vibes EP",
                actionUrl: "/projects/project-1"
              },
              {
                id: "2",
                type: "version",
                title: "New version uploaded",
                message: "David Kim uploaded version 2.3 of Midnight Blue",
                timestamp: "1 hour ago",
                read: false,
                user: {
                  id: "user-3",
                  name: "David Kim",
                  avatar: "/placeholder-user.jpg"
                },
                projectId: "project-2",
                projectTitle: "Midnight Blue",
                actionUrl: "/projects/project-2"
              },
              {
                id: "3",
                type: "emotional",
                title: "Mood Trend Alert",
                message: "Team members are feeling frustrated with the current project",
                timestamp: "3 hours ago",
                read: false,
                projectId: "project-1",
                projectTitle: "Summer Vibes EP",
                actionUrl: "/projects/project-1"
              }
            ]}
            suggestions={[
              {
                id: "suggestion-1",
                type: "conflict",
                title: "Potential Conflict Detected",
                message: "Multiple disagreements in comments on 'Drum Patterns'",
                actionLabel: "Resolve Issue",
                actionUrl: "/moderation",
                importance: "high"
              },
              {
                id: "suggestion-2",
                type: "emotional",
                title: "Collaborator Mood Check-in",
                message: "Check in with collaborators to address frustration",
                actionLabel: "Message Collaborators",
                actionUrl: "/collaborators",
                importance: "medium"
              }
            ]}
            onNotificationRead={(id) => console.log("Notification read:", id)}
            onAllNotificationsRead={() => console.log("All notifications read")}
            onNotificationRemove={(id) => console.log("Notification removed:", id)}
          />

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="bg-[#1C3F95] text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
