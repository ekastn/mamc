import { userStore } from "@/lib/store/user-store";
import { hashPassword, verifyPassword, createToken, verifyToken, TokenPayload } from "@/lib/api/auth-middleware";
import type { RegisterCredentials, LoginCredentials, AuthUser } from "@/lib/types";
import { z } from "zod";

// Define result schema using Zod
const authResultSchema = z.object({
  success: z.boolean(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    avatar: z.string().nullable(),
    bio: z.string().nullable().optional(),
  }).optional(),
  token: z.string().optional(),
  error: z.string().optional(),
});

// Export the type based on the schema
export type AuthResult = z.infer<typeof authResultSchema>;

class AuthService {
  /**
   * Register a new user
   */
  async register(userData: RegisterCredentials): Promise<AuthResult> {
    try {
      const existingUser = userStore.findByEmail(userData.email);
      
      if (existingUser) {
        return authResultSchema.parse({
          success: false,
          error: "Email already in use",
        });
      }
      
      // Hash the password before storing
      const hashedPassword = hashPassword(userData.password);
      
      // Create the new user
      const newUser = userStore.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        avatar: null,
        bio: null,
      });
      
      console.log(`[AuthService] User created with ID: ${newUser.id}`);
      
      // Generate a token for the new user using jose
      const token = await createToken({ 
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name
      });
      
      return authResultSchema.parse({
        success: true,
        user: newUser,
        token,
      });
    } catch (error) {
      console.error("[AuthService] Registration error:", error);
      return authResultSchema.parse({
        success: false,
        error: "Server error during registration",
      });
    }
  }
  
  /**
   * Login a user
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      console.log(`[AuthService] Login attempt for: ${credentials.email}`);
      
      // Find the user by email
      const user = userStore.findByEmail(credentials.email);
      
      // If user not found or password doesn't match
      if (!user) {
        console.log(`[AuthService] No user found with email: ${credentials.email}`);
        return authResultSchema.parse({
          success: false,
          error: "Invalid email or password",
        });
      }
      
      // Verify the password
      const isPasswordValid = verifyPassword(credentials.password, user.password);
      
      if (!isPasswordValid) {
        console.log(`[AuthService] Invalid password for user: ${credentials.email}`);
        return authResultSchema.parse({
          success: false,
          error: "Invalid email or password",
        });
      }
      
      console.log(`[AuthService] User authenticated successfully: ${user.email} (ID: ${user.id})`);
      
      // Generate a token for the user using jose
      const token = await createToken({ 
        userId: user.id,
        email: user.email,
        name: user.name
      });
      
      console.log(`[AuthService] Generated token with payload for user ID: ${user.id}`);
      
      return authResultSchema.parse({
        success: true,
        user,
        token,
      });
    } catch (error) {
      console.error("[AuthService] Login error:", error);
      return authResultSchema.parse({
        success: false,
        error: "Server error during login",
      });
    }
  }
  
  /**
   * Verify a token and get the user ID
   */
  async getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const payload = await verifyToken(token);
      
      if (!payload || !payload.userId) {
        return null;
      }
      
      return payload.userId;
    } catch (error) {
      console.error("[AuthService] Token verification error:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const authService = new AuthService();
