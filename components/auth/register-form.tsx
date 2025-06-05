"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import type { RegisterCredentials } from "@/lib/types"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading } = useAuth()
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (credentials.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const success = await register(credentials)
    if (!success) {
      setError("Registration failed. Please try again.")
    }
  }

  const handleChange = (field: keyof RegisterCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Card className="w-full max-w-md border-2 border-black">
      <div className="h-2 w-full bg-[#1C3F95]"></div>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold uppercase tracking-wide">Join Harmonic</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wide">
          Create your account to start collaborating
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                className="pl-10 border-2 border-black"
                disabled={isLoading}
              />
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
                className="pl-10 border-2 border-black"
                disabled={isLoading}
              />
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
                className="pl-10 border-2 border-black"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wide font-bold">
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
                className="pl-10 border-2 border-black"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <Alert className="border-2 border-[#E41E26]">
              <AlertDescription className="text-xs uppercase tracking-wide">{error}</AlertDescription>
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

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToLogin}
              className="text-xs uppercase tracking-wide"
              disabled={isLoading}
            >
              Already have an account? Sign in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
