// middleware.ts (place this in your project root, same level as package.json)
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("Middleware: User token exists:", !!req.nextauth.token)
    console.log("Middleware: Accessing:", req.nextUrl.pathname)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Return true if user has a valid token, false otherwise
        const isAuthorized = !!token
        console.log("Authorization check:", {
          path: req.nextUrl.pathname,
          hasToken: !!token,
          authorized: isAuthorized
        })
        return isAuthorized
      },
    },
    pages: {
      signIn: '/', // Redirect to home page instead of default NextAuth sign-in page
    },
  }
)

// Apply middleware to these routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/deadlines/:path*', 
    '/analytics/:path*',
    '/chat/:path*',
    '/profile/:path*'
  ]
}