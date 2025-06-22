import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api/api-response";
import { z } from 'zod';

const logoutResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    message: z.string()
  })
});

export async function POST(req: NextRequest) {
  try {
    const hasAuthToken = !!req.cookies.get("auth-token");
    
    const responseData = logoutResponseSchema.parse({
      success: true,
      data: {
        message: hasAuthToken ? "Logged out successfully" : "No active session found"
      }
    });
    
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
    
    response.cookies.delete("auth-token");
    
    // As a fallback, also set an expired cookie with the same name
    response.cookies.set({
      name: "auth-token",
      value: "",
      expires: new Date(0), 
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
