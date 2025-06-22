import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/api/auth-middleware";
import { validateProfileUpdate } from "@/lib/validations/auth-validation";

interface UpdateResult {
    success: boolean;
    user?: any;
    error?: string;
}

class UserService {
    async getUserById(userId: string): Promise<any | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });

            if (!user) return null;

            return {
                id: user.id,
                username: user.username,
                email: user.email,
            };
        } catch (error) {
            console.error("Get user error:", error);
            return null;
        }
    }

    async getUserIdFromToken(token: string): Promise<string | null> {
        try {
            const decoded = await verifyToken(token);

            if (!decoded || !decoded.userId) {
                console.log(`[UserService] Invalid token or missing userId in token`);
                return null;
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                console.log(
                    `[UserService] User ID from token not found in database: ${decoded.userId}`
                );
                return null;
            }

            return decoded.userId;
        } catch (error) {
            console.error("Token verification error:", error);
            return null;
        }
    }

    async updateUser(userId: string, updateData: any): Promise<UpdateResult> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });

            if (!user) {
                return {
                    success: false,
                    error: "User not found",
                };
            }

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
            delete sanitizedData.email; // Prevent email changes in this simple update

            // Prepare user and profile update data
            const userUpdateData: any = {};
            const profileUpdateData: any = {};

            // Map fields to the appropriate tables
            if (sanitizedData.name) userUpdateData.username = sanitizedData.name;
            if (sanitizedData.bio) profileUpdateData.bio = sanitizedData.bio;
            if (sanitizedData.avatar) profileUpdateData.avatarUrl = sanitizedData.avatar;

            // Perform the updates in a transaction
            const result = await prisma.$transaction(async (tx) => {
                // Update user if there are user fields to update
                let userResult = user;
                if (Object.keys(userUpdateData).length > 0) {
                    userResult = await tx.user.update({
                        where: { id: userId },
                        data: userUpdateData,
                        include: { profile: true },
                    });
                }

                // Update profile if there are profile fields to update
                if (Object.keys(profileUpdateData).length > 0) {
                    await tx.profile.update({
                        where: { userId: userId },
                        data: profileUpdateData,
                    });
                }

                // Get the updated user with profile
                return await tx.user.findUnique({
                    where: { id: userId },
                    include: { profile: true },
                });
            });

            // Format response
            return {
                success: true,
                user: {
                    id: result!.id,
                    name: result!.username,
                    email: result!.email,
                    avatar: result!.profile?.avatarUrl || "/placeholder-user.jpg",
                    bio: result!.profile?.bio || null,
                },
            };
        } catch (error) {
            console.error("Update user error:", error);
            return {
                success: false,
                error: "Server error during update",
            };
        }
    }

    async getAllUsers(): Promise<any[]> {
        try {
            const users = await prisma.user.findMany({
                include: { profile: true },
            });

            // Format users for response
            return users.map((user) => ({
                id: user.id,
                name: user.username,
                email: user.email,
                avatar: user.profile?.avatarUrl || "/placeholder-user.jpg",
                bio: user.profile?.bio || null,
            }));
        } catch (error) {
            console.error("Get all users error:", error);
            return [];
        }
    }
}

// Export a singleton instance
export const userService = new UserService();
