"use client";

import { UserCard } from "@/components/UserCard";
import { useSession, signOut } from "next-auth/react";
import { ExitIcon } from "@radix-ui/react-icons";
import { LoadingPage } from "@/components/LoadingPage";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();

  if (status === "loading") return <LoadingPage />;

  return (
    <div className="w-full h-full">
      <div className="absolute top-0 left-0 w-full flex flex-row justify-between items-center">
        <div className="ml-4">
          <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
            Kipi
            <span className="bg-slate-900 text-white text-2xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
              Cash
            </span>
          </h1>
        </div>
        {session && (
          <div className="w-52 py-3 px-12 mr-3 flex flex-row items-end justify-end">
            <div className="relative">
              <UserCard
                session={session}
                options={[
                  {
                    label: "Cerrar Sesión",
                    icon: <ExitIcon color="red" />,
                    className: "text-red-500",
                    onClick: () => {
                      signOut({ redirect: true });
                    },
                  },
                ]}
              />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
