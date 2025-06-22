"use server";

import Link from "next/link";
import { UserMenu } from "./user-menu";
import { Button } from "@/components/ui/button";
import { getAuthenticationStatus } from "@/lib/auth/server-auth";
import { NavigationMenu } from "./navigation-menu";

const NAV_ITEMS = [
    { name: "Dashboard", href: "/", iconName: "Home" },
    { name: "Projects", href: "/projects", iconName: "Music" },
    { name: "Activity", href: "/activity", iconName: "Bell" },
    { name: "Collaborators", href: "/collaborators", iconName: "Users" },
    { name: "Moderation", href: "/moderation", iconName: "Shield" },
];

export default async function Navigation() {
    const isAuthenticated = await getAuthenticationStatus();
    
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center">
                <div className="mr-6 flex">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold tracking-wide text-lg">HARMONIC</span>
                    </Link>
                </div>

                {!isAuthenticated ? (
                    <UnauthenticatedNav />
                ) : (
                    <>
                        <NavigationMenu navItems={NAV_ITEMS} />
                        <UserMenu />
                    </>
                )}
            </div>
        </header>
    );
}

// This can stay as a server component since it's just static links
function UnauthenticatedNav() {
    return (
        <div className="flex items-center gap-4 ml-auto">
            <Button variant="ghost" className="uppercase text-xs tracking-wide" asChild>
                <Link href="#features">Features</Link>
            </Button>
            <Button
                variant="outline"
                className="border-2 border-black uppercase text-xs tracking-wide"
                asChild
            >
                <Link href="/login">Log In</Link>
            </Button>
            <Button
                className="bg-[#E41E26] hover:bg-[#E41E26]/90 text-white uppercase text-xs tracking-wide"
                asChild
            >
                <Link href="/register">Get Started</Link>
            </Button>
        </div>
    );
}
