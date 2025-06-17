import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link
                            href="/landing"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="h-8 w-8 bg-[#E41E26] border-2 border-black"></div>
                        <span className="text-2xl font-bold uppercase tracking-wide">Harmonic</span>
                    </div>
                    <h1 className="text-2xl font-bold uppercase tracking-wide">Join Harmonic</h1>
                    <p className="text-muted-foreground">
                        Create your account and start collaborating
                    </p>
                </div>

                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="h-2 w-full bg-[#1C3F95]"></div>
                    <CardHeader>
                        <CardTitle className="uppercase tracking-wide">Create Account</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-[#1C3F95] hover:underline font-medium"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
