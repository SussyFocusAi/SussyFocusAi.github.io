// middleware.ts (place this in your project root, same level as package.json)
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // This function runs for protected routes
    console.log("Protected route accessed:", req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Simply return true if token exists, false otherwise
        return !!token
      },
    },
  }
)

// Only apply to these specific routes
export const config = {
  matcher: [
    "/dashboard",
    "/deadlines", 
    "/analytics",
    "/chat",
    "/profile"
  ]
}