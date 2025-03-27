import { DefaultSession, DefaultUser } from "next-auth";
import { RolType } from "@/app/types/rol";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: RolType | null;
      qrImgUrl?: string;
      walletAddress?: string;
      banUntil?: Date | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: RolType | null;
    qrImgUrl?: string;
    walletAddress?: string;
    banUntil?: Date | null;
  }
}
