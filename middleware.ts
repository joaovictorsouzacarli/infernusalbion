import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is for admin routes
  const isAdminRoute = path.startsWith("/admin") && path !== "/admin/login"

  // Get the token from localStorage (if it exists)
  const isAuthenticated = request.cookies.get("adminAuth")?.value === "true"

  // If trying to access admin routes without authentication
  if (isAdminRoute && !isAuthenticated) {
    const url = new URL("/admin/login", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // If trying to access login page while authenticated
  if (path === "/admin/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by the middleware
export const config = {
  matcher: ["/admin/:path*"],
}

