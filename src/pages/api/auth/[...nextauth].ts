// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo user (you can remove this later)
        if (credentials.email === 'demo@focusai.com' && credentials.password === 'demo123') {
          return {
            id: 'demo-user-id',
            email: 'demo@focusai.com',
            name: 'Demo User',
          }
        }

        // For now, we'll just reject other credentials since we're not storing passwords
        // You'd typically validate against your user table here
        return null
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    })
  ],
  
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url === baseUrl + '/api/auth/signin' || url === baseUrl + '/api/auth/callback/credentials') {
        return baseUrl + '/dashboard'
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})