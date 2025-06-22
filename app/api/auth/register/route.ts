import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/api/auth-service";
import { registerSchema } from "@/lib/validations/auth-validation";
import { errorResponse, successResponse } from "@/lib/api/api-response";

export async function POST(req: NextRequest) {
    try {
        // Parse the request body
        const body = await req.json();

        const parseResult = registerSchema.safeParse(body);
        if (!parseResult.success) {
            const errors = parseResult.error.errors.reduce((acc, err) => {
                const path = err.path.join(".");
                acc[path] = err.message;
                return acc;
            }, {} as Record<string, string>);

            return errorResponse("Validation error", 400, errors);
        }

        const result = await authService.register(parseResult.data);

        if (!result.success) {
            return errorResponse(result.error || "Registration failed", 400);
        }

        if (!result.user || !result.token) {
            return errorResponse("Registration succeeded but user data is missing", 500);
        }

        const userData = {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
        };

        const response = NextResponse.json({ success: true, data: userData }, { status: 201 });

        // const response = successResponse(userData, 201);

        // Define token expiration in milliseconds (7 days)
        const TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

        response.cookies.set({
            name: "auth-token",
            value: result.token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: TOKEN_EXPIRATION_MS / 1000, // Convert to seconds for maxAge
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("[Register API] Server error:", error);
        return errorResponse("Server error during registration", 500);
    }
}
