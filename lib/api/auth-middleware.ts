import { NextRequest } from "next/server";
import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from "@/lib/prisma";

// Secret key for JWT (in production, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "harmonic-dev-secret-key";
// Create a TextEncoder for the JWT secret
const textEncoder = new TextEncoder();
// Create a secret key from the JWT_SECRET
const secretKey = new Uint8Array(textEncoder.encode(JWT_SECRET));

// Token payload schema using Zod
export const tokenPayloadSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  username: z.string().optional(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

// Export the type for use in other files
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;

/**
 * Extracts the auth token from the request cookies
 */
export function getAuthToken(req: NextRequest): string | null {
  const token = req.cookies.get("auth-token")?.value;
  return token || null;
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secretKey);
    
    // Validate the payload structure using Zod
    const result = tokenPayloadSchema.safeParse(payload);
    
    if (!result.success) {
      console.error("[AuthMiddleware] Token payload validation failed:", result.error);
      return null;
    }
    
    return result.data;
  } catch (error: any) { // Type assertion for error
    // Provide more detailed error information
    if (error.code === 'ERR_JWT_EXPIRED') {
      try {
        const decoded = await jose.decodeJwt(token);
        console.log(`[AuthMiddleware] Expired token belonged to user ID: ${decoded.userId}`);
      } catch (decodeError) {
        console.error("[AuthMiddleware] Could not decode expired token:", decodeError);
      }
    } else {
      console.error("[AuthMiddleware] Token verification error:", error);
    }
    return null;
  }
}

/**
 * Creates a new JWT token for a user
 */
export async function createToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, expiresIn: string = "7d"): Promise<string> {
  try {
    // Validate the payload with Zod (excluding iat and exp which will be added by jose)
    const validatedPayload = tokenPayloadSchema
      .omit({ iat: true, exp: true })
      .parse(payload);
    
    // Create a JWT using jose
    const jwt = await new jose.SignJWT(validatedPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(expiresIn) // Use the string directly, jose will parse it correctly
      .sign(secretKey);
    
    // Debug token after creation
    console.log(`[AuthMiddleware] Created token with expiration: ${expiresIn}`);
    debugToken(jwt);
    
    return jwt;
  } catch (error) {
    console.error("[AuthMiddleware] Token creation error:", error);
    throw new Error("Failed to create authentication token");
  }
}

/**
 * Hashes a password using bcrypt
 */
export function hashPassword(password: string): string {
  // Use a salt rounds of 10 for good security/performance balance
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Verifies a password against a hash using bcrypt
 */
export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

/**
 * Logs detailed information about a token
 */
export async function debugToken(token: string): Promise<void> {
  try {
    // Decode the token without verification
    const decoded = await jose.decodeJwt(token);
    
    // Cast to any to access the properties
    const payload = decoded as any;
    
    // Check if payload has required fields
    if (!payload || !payload.exp) {
      console.error("[AuthMiddleware] Invalid token payload");
      return;
    }
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp && payload.exp < now;
    
    console.log("[AuthMiddleware] Token debug info:");
    console.log(`- User ID: ${payload.userId}`);
    console.log(`- Issued at: ${payload.iat ? new Date(payload.iat * 1000).toISOString() : 'unknown'}`);
    console.log(`- Expires at: ${new Date(payload.exp * 1000).toISOString()}`);
    console.log(`- Is expired: ${isExpired ? "YES" : "No"}`);
    console.log(`- Time left: ${payload.exp - now} seconds`);
    
  } catch (error) {
    console.error("[AuthMiddleware] Error debugging token:", error);
  }
}

/**
 * Enhanced token validation that:
 * 1. Verifies the JWT cryptographically
 * 2. Checks if the user exists in the database
 * 3. Optionally validates additional security claims
 */
export async function validateTokenWithDb(token: string, options: { 
  checkUserExists?: boolean; 
  checkLastPasswordChange?: boolean;
} = {}): Promise<TokenPayload | null> {
  try {
    // First verify the token cryptographically
    const payload = await verifyToken(token);
    
    if (!payload || !payload.userId) {
      console.log("[AuthMiddleware] Invalid token payload");
      return null;
    }
    
    // Check if the user exists in the database (if requested)
    if (options.checkUserExists !== false) {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });
      
      if (!user) {
        console.log(`[AuthMiddleware] User not found for token: ${payload.userId}`);
        return null;
      }
    }
    
    // Add additional security checks here as needed
    // Example: check if the user has changed password since token was issued
    
    return payload;
  } catch (error) {
    console.error("[AuthMiddleware] Token validation error:", error);
    return null;
  }
}
