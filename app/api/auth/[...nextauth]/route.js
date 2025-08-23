import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Credential for login", credentials);

        // Check hardcoded or in-memory user (example)
        // In production, this must be replaced with database or API check
        const registeredUser = {
          name: credentials?.name,
          password: credentials?.password, // this should match the registered password
          role: "user",
          email: credentials?.email || "example@email.com"
        };

        if (
          credentials.name === registeredUser.name &&   
          credentials.password === registeredUser.password
        ) {
          return {
            id: 1,
            name: registeredUser.name,
            role: registeredUser.role,
            email: registeredUser.email
          };
        }

        return null; // login failed
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token. name = user.name;
        token.role = user.role;
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          name: token.name,
          role: token.role,
          email: token.email,
          id: token.id
        };
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
