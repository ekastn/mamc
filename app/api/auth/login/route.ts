import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/lib/services/api/auth-service";
import { loginSchema, validateLoginInput } from "@/lib/validations/auth-validation";
import { errorResponse, createApiResponse } from "@/lib/api/api-response";
import { debugToken } from "@/lib/api/auth-middleware";
import { z } from "zod";

// Define a response schema using Zod
const loginResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
});

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
    
    const userData = loginResponseSchema.parse({
      id: result.user?.id,
      name: result.user?.name,
      email: result.user?.email,
      avatar: result.user?.avatar || "/placeholder-user.jpg",
    });
    
    const response = NextResponse.json(
      { success: true, data: userData },
      { status: 200 }
    );
    
    // Define token expiration in milliseconds (7 days)
    const TOKEN_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000;
    
    // Set the auth token cookie
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

// Helper function to format Zod errors
function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}
