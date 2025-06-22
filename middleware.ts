import { NextResponse } from "next/server";
import { validateTokenWithDb } from "./lib/api/auth-middleware";

const authRoutes = ["/login", "/register"];
const publicRoutes = ["/", "/login", "/register"];

export default async function middleware(request) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("auth-token")?.value;

    let isAuthenticated = !!token;
    
    // // Validate the JWT token if it exists
    // if (token) {
    //     try {
    //         const payload = await validateTokenWithDb(token);
    //         isAuthenticated = !!payload;
    //     } catch (error) {
    //         console.error("Middleware token validation error:", error);
    //     }
    // }

    console.log("Middleware check:", {
        pathname,
        isAuthenticated,
        tokenPresent: !!token,
    });

    if (isAuthenticated && authRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isAuthenticated && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If path is public, allow access regardless of authentication
    if (publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
        return NextResponse.next();
    }

    if (!isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         * - api routes that handle their own auth
         */
        "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
    ],
};
