"use client";

import type React from "react";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import LandingPage from "../landing-page";
import { usePathname } from "next/navigation";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground uppercase tracking-wide">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    const isAuthRoute = pathname === "/login" || pathname === "/register";

    if (!user?.isAuthenticated && !isAuthRoute) {
        if (isAuthRoute) {
            return <>{children}</>;
        }

        return <LandingPage />;
    }

    if (user?.isAuthenticated && isAuthRoute) {
        window.location.href = "/";
        return null;
    }

    return <>{children}</>;
}
