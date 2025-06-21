/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

/**
 * Creates a success response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * Creates an error response
 */
export function createErrorResponse(
  error: string,
  errors?: Record<string, string>
): ApiResponse {
  return {
    success: false,
    error,
    errors,
  };
}

import { NextResponse } from "next/server";

/**
 * Creates a NextResponse with success data
 */
export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json(
    createSuccessResponse(data),
    { status }
  );
}

/**
 * Creates a NextResponse with error data
 */
export function errorResponse(
  error: string, 
  status: number = 400, 
  errors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    createErrorResponse(error, errors),
    { status }
  );
}

/**
 * Creates a customized NextResponse (for cases like setting cookies)
 */
export function createApiResponse<T>(
  data: T, 
  options: { 
    status?: number; 
    cookies?: Array<{ name: string; value: string; options?: any }>;
    headers?: Record<string, string>;
  } = {}
): NextResponse {
  const { status = 200, cookies = [], headers = {} } = options;
  const response = NextResponse.json(
    createSuccessResponse(data),
    { status, headers }
  );
  
  // Set cookies if provided
  cookies.forEach(cookie => {
    if (cookie.name && cookie.value) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
  });
  
  return response;
}
