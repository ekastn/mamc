"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationCenter } from "@/components/notification-center";
import { useAuth } from "@/lib/context/auth-context";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
    const router = useRouter();
    const { user, logout, isLoading } = useAuth();
    
    // Example notifications - in a real app these would come from an API or context
    const mockNotifications = [
        {
            id: "1",
            type: "comment" as const,
            title: "New comment on Summer Vibes EP",
            message: "Maria Rodriguez commented on your track",
            timestamp: "2 minutes ago",
            read: false,
            user: {
                id: "user-2",
                name: "Maria Rodriguez",
                avatar: "/placeholder-user.jpg",
            },
            projectId: "project-1",
            projectTitle: "Summer Vibes EP",
            actionUrl: "/projects/project-1",
        },
        {
            id: "2",
            type: "version" as const,
            title: "New version uploaded",
            message: "David Kim uploaded version 2.3 of Midnight Blue",
            timestamp: "1 hour ago",
            read: false,
            user: {
                id: "user-3",
                name: "David Kim",
                avatar: "/placeholder-user.jpg",
            },
            projectId: "project-2",
            projectTitle: "Midnight Blue",
            actionUrl: "/projects/project-2",
        },
        {
            id: "3",
            type: "emotional" as const,
            title: "Mood Trend Alert",
            message: "Team members are feeling frustrated with the current project",
            timestamp: "3 hours ago",
            read: false,
            projectId: "project-1",
            projectTitle: "Summer Vibes EP",
            actionUrl: "/projects/project-1",
        },
    ];

    const mockSuggestions = [
        {
            id: "suggestion-1",
            type: "conflict" as const,
            title: "Potential Conflict Detected",
            message: "Multiple disagreements in comments on 'Drum Patterns'",
            actionLabel: "Resolve Issue",
            actionUrl: "/moderation",
            importance: "high" as const,
        },
        {
            id: "suggestion-2",
            type: "emotional" as const,
            title: "Collaborator Mood Check-in",
            message: "Check in with collaborators to address frustration",
            actionLabel: "Message Collaborators",
            actionUrl: "/collaborators",
            importance: "medium" as const,
        },
    ];

    const handleLogout = async () => {
        try {
            const success = await logout();

            if (success) {
                window.location.href = '/login';
            } else {
                router.push('/login');
            }
        } catch (error) {
            router.push('/login');
        }
    };

    if (isLoading || !user) {
        return null;
    }

    return (
        <div className="flex items-center space-x-2">
            <NotificationCenter
                notifications={mockNotifications}
                suggestions={mockSuggestions}
                onNotificationRead={(id) => console.log("Notification read:", id)}
                onAllNotificationsRead={() => console.log("All notifications read")}
                onNotificationRemove={(id) => console.log("Notification removed:", id)}
            />

            <ModeToggle />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                src="/placeholder.svg"
                                alt={user?.username || "User"}
                            />
                            <AvatarFallback className="bg-[#1C3F95] text-white">
                                {user?.username?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                            <p className="font-medium text-sm">{user?.username}</p>
                            <p className="w-[200px] truncate text-xs text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href="/profile" className="flex items-center">
                            <UserIcon className="mr-2 h-4 w-4" />
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
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
