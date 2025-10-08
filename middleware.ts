// middleware.ts (place this in your project root)
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // This runs for authenticated users
    console.log("Authenticated user accessing:", req.nextUrl.pathname)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // If no token, they're not authenticated
        if (!token) {
          return false
        }
        return true
      },
    },
    pages: {
      signIn: "/", // Redirect to homepage (where your sign-in modal is)
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/deadlines/:path*", 
    "/analytics/:path*",
    "/chat/:path*",
    "/profile/:path*"
  ]
}