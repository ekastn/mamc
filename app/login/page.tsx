import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-8 w-8 bg-[#E41E26] border-2 border-black"></div>
                        <h1 className="text-2xl font-bold uppercase tracking-wide">Welcome Back</h1>
                    </div>
                    <p className="text-muted-foreground">Sign in to continue creating music</p>
                </div>

                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="h-2 w-full bg-[#E41E26]"></div>
                    <CardHeader>
                        <CardTitle className="uppercase tracking-wide">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="text-[#E41E26] hover:underline font-medium"
                        >
                            Sign up here
                        </Link>
                    </p>
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link
                            href="/landing"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
