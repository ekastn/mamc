"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Home, Music, Users, Shield, LucideIcon } from "lucide-react";

// Map of icon names to components
const IconMap: Record<string, LucideIcon> = {
    Home,
    Music,
    Bell,
    Users,
    Shield
};

interface NavItem {
    name: string;
    href: string;
    iconName: string; // Using string name instead of component
}

interface NavigationMenuProps {
    navItems: NavItem[];
}

export function NavigationMenu({ navItems }: NavigationMenuProps) {
    const pathname = usePathname();
    
    return (
        <nav className="hidden md:flex flex-1 items-center space-x-1">
            {navItems.map((item) => {
                const Icon = IconMap[item.iconName] || Home; // Fallback to Home if icon not found
                const isActive = pathname === item.href;
                return (
                    <Button
                        key={item.href}
                        variant={isActive ? "default" : "ghost"}
                        asChild
                        size="sm"
                        className={
                            isActive ? "bg-black text-white hover:bg-black/90" : ""
                        }
                    >
                        <Link
                            href={item.href}
                            className="flex items-center space-x-1"
                        >
                            <Icon className="h-4 w-4" />
                            <span className="uppercase text-xs tracking-wide">
                                {item.name}
                            </span>
                        </Link>
                    </Button>
                );
            })}
        </nav>
    );
}
