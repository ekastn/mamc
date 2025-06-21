import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import Navigation from "@/components/navigation";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Harmonic - Social-Emotional Music Collaboration",
    description: "Collaborate on music projects with emotional awareness",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <div className="container flex min-h-screen flex-col">
                            <Navigation />
                            <AuthGuard>
                                <main className="flex-1">{children}</main>
                            </AuthGuard>
                        </div>
                    </AuthProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
