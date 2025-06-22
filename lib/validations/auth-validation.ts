import { z } from 'zod';
import type { LoginCredentials, RegisterCredentials } from "@/lib/types";

// Define the Zod schema for login credentials
export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

// Define the Zod schema for registration data
export const registerSchema = z.object({
  name: z.string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters"),
  username: z.string()
    .min(1, "Username is required")
    .min(2, "Username must be at least 2 characters")
    .max(30, "Username must be less than 30 characters"),
  email: z.string()
    .email("Invalid email format")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[!@#$%^&*]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Define the Zod schema for profile updates
export const profileUpdateSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .optional(),
  email: z.string()
    .email("Invalid email format")
    .optional(),
  bio: z.string()
    .max(500, "Bio must be less than 500 characters")
    .optional(),
});

// Export types based on the schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

// Result interface
export interface ValidationResult {
  success: boolean;
  errors?: Record<string, string>;
}

// Validate login credentials using Zod
export function validateLoginInput(data: any): ValidationResult {
  const result = loginSchema.safeParse(data);
  
  if (result.success) {
    return { success: true };
  } else {
    const errors = formatZodErrors(result.error);
    return {
      success: false,
      errors,
    };
  }
}

// Validate registration data using Zod
export function validateRegisterInput(data: any): ValidationResult {
  const result = registerSchema.safeParse(data);
  
  if (result.success) {
    return { success: true };
  } else {
    const errors = formatZodErrors(result.error);
    return {
      success: false,
      errors,
    };
  }
}

// Validate profile update data using Zod
export function validateProfileUpdate(data: any): ValidationResult {
  const result = profileUpdateSchema.safeParse(data);
  
  if (result.success) {
    return { success: true };
  } else {
    const errors = formatZodErrors(result.error);
    return {
      success: false,
      errors,
    };
  }
}

// Helper function to format Zod errors into a simple key-value object
function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}
