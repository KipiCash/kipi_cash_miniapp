import NextAuth, { NextAuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Auth0({
      clientId: process.env.AUTH0_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH0_CLIENT_SECRET ?? "",
      issuer: process.env.AUTH0_DOMAIN,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
