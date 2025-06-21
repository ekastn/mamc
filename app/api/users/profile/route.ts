import { NextRequest } from "next/server";
import { userService } from "@/lib/services/api/user-service";
import { getAuthToken, debugToken } from "@/lib/api/auth-middleware";
import { errorResponse, successResponse } from "@/lib/api/api-response";

// GET /api/users/profile - Get the current user's profile
export async function GET(req: NextRequest) {
  try {
    // Get the auth token from the cookies
    const token = getAuthToken(req);
    
    if (!token) {
      return errorResponse("Authentication required", 401);
    }
    
    // Debug token information
    debugToken(token);
    
    // Verify the token and get the user ID
    const userId = await userService.getUserIdFromToken(token);
    
    if (!userId) {
      return errorResponse("Invalid authentication token", 401);
    }
    
    // Get the user profile
    const user = await userService.getUserById(userId);
    
    if (!user) {
      console.error(`User not found with ID: ${userId}. Available user IDs: ${JSON.stringify(await userService.getAllUsers().then(users => users.map(u => u.id)))}`);
      return errorResponse("User not found", 404);
    }
    
    // Return the user profile (excluding password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
    };
    
    return successResponse(userData);
    
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse("Server error while fetching profile", 500);
  }
}

// PATCH /api/users/profile - Update the current user's profile
export async function PATCH(req: NextRequest) {
  try {
    // Get the auth token from the cookies
    const token = getAuthToken(req);
    
    if (!token) {
      return errorResponse("Authentication required", 401);
    }
    
    // Verify the token and get the user ID
    const userId = await userService.getUserIdFromToken(token);
    
    if (!userId) {
      return errorResponse("Invalid authentication token", 401);
    }
    
    // Parse the request body
    const updateData = await req.json();
    
    // Update the user profile
    const result = await userService.updateUser(userId, updateData);
    
    if (!result.success) {
      return errorResponse(result.error || "Failed to update profile", 400);
    }
    
    // Return the updated user profile
    const userData = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      avatar: result.user.avatar,
      bio: result.user.bio,
    };
    
    return successResponse(userData);
    
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse("Server error while updating profile", 500);
  }
}
