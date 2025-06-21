import { userStore } from "@/lib/store/user-store";
import { verifyToken } from "@/lib/api/auth-middleware";
import { validateProfileUpdate } from "@/lib/validations/auth-validation";

interface UpdateResult {
  success: boolean;
  user?: any;
  error?: string;
}

class UserService {
  /**
   * Get a user by ID
   */
  async getUserById(userId: string): Promise<any | null> {
    try {
      const user = userStore.findById(userId);
      return user;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }
  
  /**
   * Get a user ID from a token
   */
  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const decoded = await verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        console.log(`[UserService] Invalid token or missing userId in token`);
        return null;
      }
      
      return decoded.userId;
    } catch (error) {
      console.error("Token verification error:", error);
      return null;
    }
  }
  
  /**
   * Update a user's profile
   */
  async updateUser(userId: string, updateData: any): Promise<UpdateResult> {
    try {
      // Find the user
      const user = userStore.findById(userId);
      
      if (!user) {
        return {
          success: false,
          error: "User not found",
        };
      }
      
      // Validate the update data
      const validationResult = validateProfileUpdate(updateData);
      
      if (!validationResult.success) {
        return {
          success: false,
          error: "Validation error",
        };
      }
      
      // Prevent updating certain fields
      const sanitizedData = { ...updateData };
      delete sanitizedData.password;
      delete sanitizedData.id;
      
      // Update the user
      const updatedUser = userStore.update(userId, sanitizedData);
      
      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error("Update user error:", error);
      return {
        success: false,
        error: "Server error during update",
      };
    }
  }
  
  /**
   * Get all users (for admin purposes)
   */
  async getAllUsers(): Promise<any[]> {
    try {
      return userStore.findAll();
    } catch (error) {
      console.error("Get all users error:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const userService = new UserService();
