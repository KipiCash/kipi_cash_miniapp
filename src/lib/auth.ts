import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.AUTH_FIREBASE_PROJECT_ID,
      clientEmail: process.env.AUTH_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.AUTH_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  }),
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id as string;
      session.user.role = user.role;
      if (user.role === "exchanger")
        session.user.walletAddress = user.walletAddress;
      else if (user.role === "client") session.user.qrImgUrl = user.qrImgUrl;
      session.user.banUntil = user.banUntil;
      return session;
    },
    redirect() {
      return "/";
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
};
