/**
 * Navigation constants for the application
 */

import { Home, Music2, Users, PieChart, Settings, User } from "lucide-react"

export const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Projects", href: "/projects", icon: Music2 },
  { name: "Collaborators", href: "/collaborators", icon: Users },
  { name: "Analytics", href: "/analytics", icon: PieChart },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
]
