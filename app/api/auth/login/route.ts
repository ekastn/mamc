import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/api/auth-service";
import { loginSchema, validateLoginInput } from "@/lib/validations/auth-validation";
import { errorResponse, createApiResponse } from "@/lib/api/api-response";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parseResult = loginSchema.safeParse(body);
        if (!parseResult.success) {
            const errors = parseResult.error.format();
            return errorResponse("Validation error", 400, formatZodErrors(parseResult.error));
        }

        const result = await authService.login(parseResult.data);

        if (!result.success) {
            return errorResponse(result.error || "Authentication failed", 401);
        }

        if (!result.user || !result.token) {
            return errorResponse("Login succeeded but user data is missing", 500);
        }

        const userData = {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
        };

        const response = NextResponse.json({ success: true, data: userData }, { status: 200 });

        const TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;

        response.cookies.set({
            name: "auth-token",
            value: result.token as string,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: TOKEN_EXPIRATION_MS / 1000, // Convert to seconds for maxAge
            path: "/",
        });

        return response;
    } catch (error) {
        return errorResponse("Server error during login", 500);
    }
}

function formatZodErrors(error: z.ZodError): Record<string, string> {
    const errors: Record<string, string> = {};

    error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
    });

    return errors;
}
