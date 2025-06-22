import prisma from "@/lib/prisma";
import {
    hashPassword,
    verifyPassword,
    createToken,
    verifyToken,
    TokenPayload,
} from "@/lib/api/auth-middleware";
import type { RegisterCredentials, LoginCredentials, AuthUser } from "@/lib/types";
import { z } from "zod";

const authResultSchema = z.object({
    success: z.boolean(),
    user: z
        .object({
            id: z.string(),
            username: z.string(),
            email: z.string().email(),
        })
        .optional(),
    token: z.string().optional(),
    error: z.string().optional(),
});

export type AuthResult = z.infer<typeof authResultSchema>;

class AuthService {
    async register(userData: RegisterCredentials): Promise<AuthResult> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email },
            });

            if (existingUser) {
                return authResultSchema.parse({
                    success: false,
                    error: "Email already in use",
                });
            }

            const hashedPassword = hashPassword(userData.password);

            const newUser = await prisma.$transaction(async (tx) => {
                const user = await tx.user.create({
                    data: {
                        email: userData.email,
                        username: userData.username,
                        passwordHash: hashedPassword,
                    },
                });

                await tx.profile.create({
                    data: {
                        userId: user.id,
                        displayName: userData.name,
                    },
                });

                return user;
            });

            const token = await createToken({
                userId: newUser.id,
                email: newUser.email,
                username: newUser.username,
            });

            return authResultSchema.parse({
                success: true,
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                },
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

    async login(credentials: LoginCredentials): Promise<AuthResult> {
        try {
            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
                include: { profile: true },
            });

            if (!user) {
                console.log(`[AuthService] No user found with email: ${credentials.email}`);
                return authResultSchema.parse({
                    success: false,
                    error: "Invalid email or password",
                });
            }

            const isPasswordValid = verifyPassword(credentials.password, user.passwordHash);

            if (!isPasswordValid) {
                console.log(`[AuthService] Invalid password for user: ${credentials.email}`);
                return authResultSchema.parse({
                    success: false,
                    error: "Invalid email or password",
                });
            }


            const token = await createToken({
                userId: user.id,
                email: user.email,
                username: user.username,
            });

            return authResultSchema.parse({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                },
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

    async getUserIdFromToken(token: string): Promise<string | null> {
        try {
            const payload = await verifyToken(token);

            if (!payload || !payload.userId) {
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { id: payload.userId },
            });

            if (!user) {
                return null;
            }

            return payload.userId;
        } catch (error) {
            console.error("[AuthService] Token verification error:", error);
            return null;
        }
    }
}

export const authService = new AuthService();
