"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/lib/types";
import { generateId } from "@/lib/utils";

// Define error types for authentication
export type AuthError =
    | "invalid-credentials"
    | "email-already-in-use"
    | "weak-password"
    | "passwords-dont-match"
    | "user-not-found"
    | "network-error"
    | "invalid-format"
    | "invalid-token"
    | "session-expired"
    | "validation-error"
    | "server-error"
    | "unknown-error";

interface AuthContextType {
    user: AuthUser | null;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: AuthError }>;
    register: (
        credentials: RegisterCredentials
    ) => Promise<{ success: boolean; error?: AuthError }>;
    logout: () => void;
    isLoading: boolean;
    validateEmail: (email: string) => boolean;
    validatePassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real application, this would be handled by the backend
const DEMO_USERS: Record<string, { id: string; name: string; email: string; password: string }> = {
    "admin@harmonic.app": {
        id: "demo-user-1",
        name: "Admin User",
        email: "admin@harmonic.app",
        password: "Password123!",
    },
    "user@harmonic.app": {
        id: "demo-user-2",
        name: "Test User",
        email: "user@harmonic.app",
        password: "Password123!",
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                // In a real app, this would validate a token with the server
                const token = sessionStorage.getItem("auth-token");
                const savedUser = sessionStorage.getItem("auth-user");

                if (token && savedUser) {
                    try {
                        // Validate token format and expiration
                        const tokenData = JSON.parse(atob(token));

                        // Check if token is expired
                        if (tokenData.exp < Date.now()) {
                            console.warn("Session expired");
                            sessionStorage.removeItem("auth-token");
                            sessionStorage.removeItem("auth-user");
                            setUser(null);
                            setIsLoading(false);
                            return;
                        }

                        // Parse user data
                        const parsedUser = JSON.parse(savedUser);
                        setUser(parsedUser);
                    } catch (parseError) {
                        console.error("Invalid token format:", parseError);
                        sessionStorage.removeItem("auth-token");
                        sessionStorage.removeItem("auth-user");
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error("Failed to restore session:", error);
                sessionStorage.removeItem("auth-token");
                sessionStorage.removeItem("auth-user");
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Email validation function
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Password validation function (min 8 chars, at least 1 letter, 1 number)
    const validatePassword = (password: string): boolean => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const login = async (
        credentials: LoginCredentials
    ): Promise<{ success: boolean; error?: AuthError }> => {
        setIsLoading(true);

        try {
            // Check for empty fields first
            if (!credentials.email || !credentials.password) {
                setIsLoading(false);
                return { success: false, error: "validation-error" };
            }

            // Validate input format
            if (!validateEmail(credentials.email)) {
                setIsLoading(false);
                return { success: false, error: "invalid-format" };
            }

            // Simulate API call with some delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Demo authentication - in a real app, this would be a server request
            const demoUser = DEMO_USERS[credentials.email];

            // Check if user exists and password matches
            if (!demoUser) {
                setIsLoading(false);
                return { success: false, error: "user-not-found" };
            }

            if (demoUser.password !== credentials.password) {
                setIsLoading(false);
                return { success: false, error: "invalid-credentials" };
            }

            // Create auth user from demo data
            const authUser: AuthUser = {
                id: demoUser.id,
                name: demoUser.name,
                email: demoUser.email,
                avatar: "/placeholder-user.jpg",
                isAuthenticated: true,
            };

            // Generate a fake JWT token (in real app would come from server)
            const token = btoa(
                JSON.stringify({
                    userId: demoUser.id,
                    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                })
            );

            // Store in sessionStorage (more secure than localStorage)
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("auth-user", JSON.stringify(authUser));

            setUser(authUser);
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
            return { success: false, error: "network-error" };
        }
    };

    const register = async (
        credentials: RegisterCredentials
    ): Promise<{ success: boolean; error?: AuthError }> => {
        setIsLoading(true);

        try {
            // Check for empty fields
            if (
                !credentials.name ||
                !credentials.email ||
                !credentials.password ||
                !credentials.confirmPassword
            ) {
                setIsLoading(false);
                return { success: false, error: "validation-error" };
            }

            // Validate input
            if (!validateEmail(credentials.email)) {
                setIsLoading(false);
                return { success: false, error: "invalid-format" };
            }

            if (!validatePassword(credentials.password)) {
                setIsLoading(false);
                return { success: false, error: "weak-password" };
            }

            if (credentials.password !== credentials.confirmPassword) {
                setIsLoading(false);
                return { success: false, error: "passwords-dont-match" };
            }

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check if email is already in use
            if (DEMO_USERS[credentials.email]) {
                setIsLoading(false);
                return { success: false, error: "email-already-in-use" };
            }

            // In a real app, this would create a new user on the server
            const userId = generateId("user-");

            // Create auth user
            const authUser: AuthUser = {
                id: userId,
                name: credentials.name,
                email: credentials.email,
                avatar: "/placeholder-user.jpg",
                isAuthenticated: true,
            };

            // Generate a fake JWT token
            const token = btoa(
                JSON.stringify({
                    userId: userId,
                    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
                })
            );

            // Store in sessionStorage
            sessionStorage.setItem("auth-token", token);
            sessionStorage.setItem("auth-user", JSON.stringify(authUser));

            setUser(authUser);
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            setIsLoading(false);
            return { success: false, error: "network-error" };
        }
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("auth-token");
        sessionStorage.removeItem("auth-user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                isLoading,
                validateEmail,
                validatePassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
