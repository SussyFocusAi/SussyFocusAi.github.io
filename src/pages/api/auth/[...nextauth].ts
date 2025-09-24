  // src/pages/api/auth/[...nextauth].ts - Debug Version
  import NextAuth from 'next-auth'
  import GoogleProvider from 'next-auth/providers/google'
  import GitHubProvider from 'next-auth/providers/github'
  import CredentialsProvider from 'next-auth/providers/credentials'

  export default NextAuth({
    providers: [
      // Email & Password Authentication
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          console.log('Authorize called with:', {
            email: credentials?.email,
            password: credentials?.password ? '***' : 'undefined'
          });

          // Make sure credentials exist
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing email or password');
            return null;
          }

          // Demo users - replace with real database lookup
          const demoUsers = [
            {
              id: '1',
              email: 'demo@focusai.com',
              password: 'demo123',
              name: 'Demo User',
              image: null
            },
            {
              id: '2', 
              email: 'user@example.com',
              password: 'password123',
              name: 'John Doe',
              image: null
            }
          ];

          console.log('Looking for user with email:', credentials.email);

          const user = demoUsers.find(
            u => u.email.toLowerCase() === credentials.email.toLowerCase()
          );

          console.log('Found user:', user ? 'Yes' : 'No');

          if (user) {
            console.log('Comparing passwords:', {
              provided: credentials.password,
              expected: user.password,
              match: user.password === credentials.password
            });

            if (user.password === credentials.password) {
              console.log('Authentication successful for:', user.email);
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              };
            } else {
              console.log('Password mismatch');
            }
          }

          console.log('Authentication failed');
          return null; // Invalid credentials
        }
      }),

      // Google OAuth
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      }),

      // GitHub OAuth  
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      })
    ],

    // Custom pages
    pages: {
      signIn: '/', // We'll use our modal instead of default page
    },

    // Enable debug mode
    debug: true,

    // Callbacks for customization
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).id = token.id;
        }
        return session;
      },
    },

    // Session settings
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },

    // Security
    secret: process.env.NEXTAUTH_SECRET,
  });