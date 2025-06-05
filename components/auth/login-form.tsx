"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import type { LoginCredentials } from "@/lib/types"

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading } = useAuth()
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!credentials.email || !credentials.password) {
      setError("Please fill in all fields")
      return
    }

    const success = await login(credentials)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  const handleChange = (field: keyof LoginCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [field]: e.target.value }))
  }

  return (
    <Card className="w-full max-w-md border-2 border-black">
      <div className="h-2 w-full bg-[#E41E26]"></div>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold uppercase tracking-wide">Welcome Back</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wide">Sign in to your Harmonic account</CardDescription>
      </CardHeader>
      <CardContent>
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
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange("password")}
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
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={onSwitchToRegister}
              className="text-xs uppercase tracking-wide"
              disabled={isLoading}
            >
              Don't have an account? Sign up
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
