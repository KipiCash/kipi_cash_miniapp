"use client";
import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Noice } from "@/components/Noice";

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (path !== "/") {
      if (status === "authenticated") {
        if (session.user.role) {
          if (session.user.role === "admin" && !path.includes("admin")) {
            router.replace("/admin");
          } else if (
            session.user.role === "client" &&
            !path.includes("client")
          ) {
            router.replace("/client");
          } else if (
            session.user.role === "exchanger" 
          ) {
            if (!session.user.walletAddress) {
              router.replace("/auth/savewallet");
            } else if (!path.includes("exchanger")) {
              router.replace("/exchanger");
            }
          }
        } else {
          router.replace("/auth/uploadqr");
        }
      } else {
        router.replace("/auth/login");
      }
    }
  }, [path, session, status, router]);

  if (
    status === "loading" ||
    (status === "authenticated" && !( (session.user.role && path.includes(`${session?.user?.role}`))||(!session.user.role && path.includes("auth/uploadqr"))||(session.user.role === "exchanger" && !session.user.walletAddress && path.includes("auth/savewallet")) )
    ) && path !== "/"
  ) 
    return (
      <Noice
        noice={{
          type: "loading",
          message: "Un momento...",
          styleType: "page",
        }}
      />
    );

  return children;
};
