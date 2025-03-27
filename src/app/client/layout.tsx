"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { UserCard } from "@/components/UserCard";
import {
  CountdownTimerIcon,
  ExitIcon,
  PlusIcon,
  PersonIcon,
} from "@radix-ui/react-icons";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <div>Cargando...</div>;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="w-full flex flex-row justify-between items-center">
        <div className="ml-4">
          <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
            Kipi
            <span className="bg-slate-900 text-white text-2xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
              Cash
            </span>
          </h1>
        </div>
        {session && (
          <div className="w-52 py-3 px-12 flex flex-row items-end justify-end">
            <div className="relative">
              <UserCard
                session={session}
                options={[
                  {
                    label: "Perfil",
                    icon: <PersonIcon />,
                    onClick: () => {
                      router.replace("/client/info");
                    },
                  },
                  {
                    label: "Nueva transaccion",
                    icon: <PlusIcon />,
                    onClick: () => {
                      router.replace("/client");
                    },
                  },
                  {
                    label: "Todas mis transacciones",
                    icon: <CountdownTimerIcon />,
                    onClick: () => {
                      router.replace("/client/allRequest");
                    },
                  },
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
