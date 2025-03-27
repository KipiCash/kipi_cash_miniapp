"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type WorldAppUser = {
  username: string | null;
  profilePictureUrl: string | null;
  walletAddress: string | null;
};

interface UserContextType {
  user: WorldAppUser | null;
  setUser: React.Dispatch<React.SetStateAction<WorldAppUser | null>>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<WorldAppUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (
          MiniKit.isInstalled() &&
          MiniKit.user &&
          MiniKit.user.username &&
          MiniKit.walletAddress
        ) {
          setUser(MiniKit.user);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
