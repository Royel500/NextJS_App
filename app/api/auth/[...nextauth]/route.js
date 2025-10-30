// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbconnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required");
          }

          const collection = await dbConnect('userCollection');
          
          // Find user by email (case insensitive)
          const user = await collection.findOne({ 
            email: credentials.email.toLowerCase().trim() 
          });

          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if user account is active
          if (user.status === 'inactive' || user.status === 'suspended') {
            throw new Error("Account is inactive. Please contact support.");
          }

          // Compare hashed password
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object without sensitive data
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            image: user.photoURL,
            phone: user.phone,
            status: user.status || 'active'
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user', // Default role for Google signups
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
        token.status = user.status;
      }

      // Update session when update() is called
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      // For Google OAuth, you might want to create/update user in your DB
      if (account?.provider === "google" && user) {
        try {
          const collection = await dbConnect('userCollection');
          const existingUser = await collection.findOne({ email: user.email });

          if (!existingUser) {
            // Create new user for Google signup
            await collection.insertOne({
              name: user.name,
              email: user.email,
              photoURL: user.image,
              role: 'user',
              provider: 'google',
              emailVerified: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              status: 'active'
            });
          } else {
            // Update existing user
            await collection.updateOne(
              { email: user.email },
              { 
                $set: { 
                  lastLogin: new Date(),
                  updatedAt: new Date(),
                  photoURL: user.image || existingUser.photoURL
                } 
              }
            );
          }
        } catch (error) {
          console.error("Google OAuth user creation error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        image: token.image,
        phone: token.phone,
        status: token.status
      };
      
      session.accessToken = token.accessToken;
      return session;
    },

    async signIn({ user, account, profile }) {
      try {
        // Allow all sign ins for now
        // You can add additional checks here if needed
        if (account?.provider === "google") {
          // Additional Google sign-in checks can go here
          return true;
        }
        
        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/login?error=AuthenticationFailed",
    verifyRequest: "/login?message=VerifyEmail",
    newUser: "/welcome" // Redirect after first sign up
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Security settings
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',

  // Secret for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
