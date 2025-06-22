"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, User, AlertTriangle } from "lucide-react";
import { useAuth, type AuthError } from "@/context/auth-context";
import type { RegisterCredentials } from "@/lib/types";
import { useRouter } from "next/router";

export function RegisterForm() {
    const { register, isLoading, validateEmail, validatePassword } = useAuth();
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        username?: string;
        password?: string;
        confirmPassword?: string;
        general?: string;
    }>({});

    const router = useRouter();

    const getErrorMessage = (error: AuthError): string => {
        switch (error) {
            case "email-already-in-use":
                return "This email is already registered";
            case "weak-password":
                return "Password must be at least 8 characters with letters and numbers";
            case "passwords-dont-match":
                return "Passwords do not match";
            case "network-error":
                return "Network error. Please try again later";
            case "invalid-format":
                return "Invalid email format";
            case "validation-error":
                return "Please fill in all required fields";
            case "server-error":
                return "Server error. Please try again later";
            default:
                return "Registration failed. Please try again";
        }
    };

    const validateForm = (): boolean => {
        const newErrors: {
            name?: string;
            username?: string;
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!credentials.name) {
            newErrors.name = "Name is required";
        } else if (credentials.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!credentials.username) {
            newErrors.username = "Username is required";
        } else if (credentials.username.length < 2) {
            newErrors.username = "Username must be at least 2 characters";
        } else if (credentials.username.length > 30) {
            newErrors.username = "Username must be less than 30 characters";
        }

        if (!credentials.email) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(credentials.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!credentials.password) {
            newErrors.password = "Password is required";
        } else if (!validatePassword(credentials.password)) {
            newErrors.password = "Password must be at least 8 characters with letters and numbers";
        }

        if (!credentials.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (credentials.password !== credentials.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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

        const result = await register(credentials);

        if (!result.success) {
            setErrors({
                general: getErrorMessage(result.error || "unknown-error"),
            });
        } else {
            router.push("/dashboard");
        }
    };

    const handleChange =
        (field: keyof RegisterCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
            setCredentials((prev) => ({ ...prev, [field]: e.target.value }));
        };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wide font-bold">
                    Full Name
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={credentials.name}
                        onChange={handleChange("name")}
                        className={`pl-10 border-2 ${
                            errors.name ? "border-[#E41E26]" : "border-black"
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                        <p
                            id="name-error"
                            className="text-xs text-[#E41E26] mt-1 flex items-center"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.name}
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase tracking-wide font-bold">
                    Username
                </Label>
                <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={credentials.username}
                        onChange={handleChange("username")}
                        className={`pl-10 border-2 ${
                            errors.username ? "border-[#E41E26]" : "border-black"
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.username}
                        aria-describedby={errors.username ? "username-error" : undefined}
                    />
                    {errors.username && (
                        <p
                            id="username-error"
                            className="text-xs text-[#E41E26] mt-1 flex items-center"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.username}
                        </p>
                    )}
                </div>
            </div>

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
                        placeholder="Create a password"
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

            <div className="space-y-2">
                <Label
                    htmlFor="confirmPassword"
                    className="text-xs uppercase tracking-wide font-bold"
                >
                    Confirm Password
                </Label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={credentials.confirmPassword}
                        onChange={handleChange("confirmPassword")}
                        className={`pl-10 border-2 ${
                            errors.confirmPassword ? "border-[#E41E26]" : "border-black"
                        }`}
                        disabled={isLoading}
                        aria-invalid={!!errors.confirmPassword}
                        aria-describedby={
                            errors.confirmPassword ? "confirm-password-error" : undefined
                        }
                    />
                    {errors.confirmPassword && (
                        <p
                            id="confirm-password-error"
                            className="text-xs text-[#E41E26] mt-1 flex items-center"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {errors.confirmPassword}
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
                        Creating Account...
                    </>
                ) : (
                    "Create Account"
                )}
            </Button>
        </form>
    );
}
