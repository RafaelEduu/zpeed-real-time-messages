import { api } from "@/app/lib/api";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

/* declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name: string;
			image: string;
			email: string;
		};
	}
} */

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      
      return {...token, ...user, ...account};
    },

    async session({ session, token, user }) {
      session.user = token as any

      return session;
    },

    async signIn({user, account, profile}) {
      try {
        await api.post("/register", {
          gitHubId: profile?.sub,
          name: profile?.name,
          login: profile?.email,
          avatarUrl: user?.image, 
        });
      } catch (error) {
        console.log(error)
      }

      return true
    }
  },
});
export { handler as GET, handler as POST };

