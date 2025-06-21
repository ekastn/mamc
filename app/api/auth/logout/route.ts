import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/api-response";
import { z } from 'zod';

// Define response schema using Zod
const logoutResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string()
  })
});

export async function POST(req: NextRequest) {
  try {
    const responseData = logoutResponseSchema.parse({
      success: true,
      data: {
        message: "Logged out successfully"
      }
    });
    
    // Create a direct NextResponse for more control over cookie clearing
    const response = NextResponse.json(
      responseData,
      { 
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        }
      }
    );
    
    // Explicitly clear the auth-token cookie
    response.cookies.delete("auth-token");
    
    // As a fallback, also set an expired cookie with the same name
    response.cookies.set({
      name: "auth-token",
      value: "",
      expires: new Date(0), // Set to epoch time (1970-01-01)
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("[Logout API] Server error:", error);
    return errorResponse("Server error during logout", 500);
  }
}
