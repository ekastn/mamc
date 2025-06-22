"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser, LoginCredentials, RegisterCredentials } from "@/lib/types";
import { validateLoginInput, validateRegisterInput } from "@/lib/validations/auth-validation";

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
    logout: () => Promise<boolean>;
    isLoading: boolean;
    validateEmail: (email: string) => boolean;
    validatePassword: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/users/profile', {
                    credentials: 'include',
                    cache: 'no-store'
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    
                    const authUser: AuthUser = {
                        id: userData.data.id,
                        username: userData.data.username,
                        email: userData.data.email,
                    };
                    
                    setUser(authUser);
                } else {
                    const errorData = await response.json();

                    console.log("[AuthContext] Authentication check failed:", errorData);
                    
                    if (response.status === 401) {
                        console.log("[AuthContext] Token expired or invalid, cleaning up");
                    }
                    
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to check authentication status:", error);
                setUser(null);
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
            // Validate input
            const validationResult = validateLoginInput(credentials);
            if (!validationResult.success) {
                setIsLoading(false);
                return { success: false, error: "validation-error" };
            }

            // Call the login API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials to ensure cookies are handled
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            
            if (!response.ok) {
                setIsLoading(false);
                
                // Map the API error to our AuthError type
                let errorType: AuthError = "unknown-error";
                
                if (data.error === "Invalid email or password") {
                    errorType = "invalid-credentials";
                } else if (data.error === "User not found") {
                    errorType = "user-not-found";
                } else if (data.error === "Validation error") {
                    errorType = "validation-error";
                } else if (data.error === "Server error during login") {
                    errorType = "server-error";
                }
                
                return { success: false, error: errorType };
            }

            // Create auth user from response data
            const authUser: AuthUser = {
                id: data.data.id,
                username: data.data.username,
                email: data.data.email,
            };

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
            const validationResult = validateRegisterInput(credentials);
            if (!validationResult.success) {
                setIsLoading(false);
                return { success: false, error: "validation-error" };
            }

            // Call the register API
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            
            if (!response.ok) {
                setIsLoading(false);
                
                let errorType: AuthError = "unknown-error";
                
                if (data.error === "Email already in use") {
                    errorType = "email-already-in-use";
                } else if (data.error.includes("password")) {
                    errorType = "weak-password";
                } else if (data.error === "Validation error") {
                    errorType = "validation-error";
                } else if (data.error === "Server error during registration") {
                    errorType = "server-error";
                }
                
                return { success: false, error: errorType };
            }

            const authUser: AuthUser = {
                id: data.data.id,
                username: data.data.username,
                email: data.data.email,
            };

            // Update React state with user data
            setUser(authUser);
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            console.error("Registration error:", error);
            setIsLoading(false);
            return { success: false, error: "network-error" };
        }
    };

    const logout = async (): Promise<boolean> => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', 
                cache: 'no-store' 
            });
            
            setUser(null);
            window.location.href = '/login';
            return true;
        } catch (error) {
            console.error("Logout error:", error);
            setUser(null);
            window.location.href = '/login';
            return true;
        }
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
