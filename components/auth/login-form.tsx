"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, AlertTriangle, Info } from "lucide-react";
import { useAuth, type AuthError } from "@/lib/context/auth-context";
import type { LoginCredentials } from "@/lib/types";

export function LoginForm() {
    const { login, isLoading, validateEmail, user } = useAuth();
    const router = useRouter();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    const getErrorMessage = (error: AuthError): string => {
        switch (error) {
            case "invalid-credentials":
                return "Invalid email or password";
            case "user-not-found":
                return "No account found with this email";
            case "network-error":
                return "Network error. Please try again later";
            case "invalid-format":
                return "Invalid email format";
            case "validation-error":
                return "Please fill in all required fields";
            case "session-expired":
                return "Your session has expired. Please log in again";
            case "invalid-token":
                return "Authentication error. Please log in again";
            case "server-error":
                return "Server error. Please try again later";
            default:
                return "An error occurred. Please try again";
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {
            email?: string;
            password?: string;
        } = {};

        if (!credentials.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(credentials.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!credentials.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setErrors({});

        if (!validateForm()) {
            return;
        }

        const result = await login(credentials);

        if (result.success) {
            // Force a full page refresh to update server components
            window.location.href = "/";
            return;
        } else {
            setErrors({
                general: getErrorMessage(result.error || "unknown-error"),
            });
        }
    };

    const handleChange =
        (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
        };

    const useDemoAccount = async (email: string, password: string) => {
        setCredentials({ email, password });

        setErrors({});

        const result = await login({ email, password });

        if (result.success) {
            router.push("/");
        } else {
            setErrors({
                general: getErrorMessage(result.error || "unknown-error"),
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wide font-bold">
                    Email
                </Label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={credentials.email}
                        onChange={handleChange("email")}
                        className={`pl-10 border-2 ${
                            errors.email ? "border-[#E41E26]" : "border-black"
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                        <p
                            id="email-error"
                            className="text-xs text-[#E41E26] mt-1 flex items-center"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wide font-bold">
                    Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={handleChange("password")}
                        className={`pl-10 border-2 ${
                            errors.password ? "border-[#E41E26]" : "border-black"
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                        aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && (
                        <p
                            id="password-error"
                            className="text-xs text-[#E41E26] mt-1 flex items-center"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.password}
                        </p>
                    )}
                </div>
            </div>

            {errors.general && (
                <Alert className="border-2 border-[#E41E26]">
                    <AlertDescription className="text-xs uppercase tracking-wide flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {errors.general}
                    </AlertDescription>
                </Alert>
            )}

            <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90 uppercase text-xs tracking-wide"
                disabled={isLoading}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                    </>
                ) : (
                    "Sign In"
                )}
            </Button>

            {/* Demo Accounts Section */}
            <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                    <Info className="h-3 w-3 mr-1" />
                    <span>Demo Accounts</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => useDemoAccount("admin@harmonic.app", "Password123!")}
                        className="text-xs border-black hover:bg-gray-100"
                        disabled={isLoading}
                    >
                        Admin User
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => useDemoAccount("user@harmonic.app", "Password123!")}
                        className="text-xs border-black hover:bg-gray-100"
                        disabled={isLoading}
                    >
                        Test User
                    </Button>
                </div>
            </div>
        </form>
    );
}
