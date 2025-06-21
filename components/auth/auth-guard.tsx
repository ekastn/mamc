"use client";

import type React from "react";

import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import LandingPage from "../landing-page";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    
    const isAuthRoute = pathname === "/login" || pathname === "/register";
    
    useEffect(() => {
        if (!isLoading) {
            if (user?.isAuthenticated && isAuthRoute) {
                router.push('/');
            }
        }
    }, [user, isAuthRoute, isLoading, router]);

    // Loading state
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

    if (!user?.isAuthenticated) {
        if (isAuthRoute) {
            return <>{children}</>;
        }
        
        return <LandingPage />;
    }
    
    if (user.isAuthenticated) {
        if (isAuthRoute) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">
                            Redirecting...
                        </p>
                    </div>
                </div>
            );
        }
        
        return <>{children}</>;
    }

    return <>{children}</>;
}
