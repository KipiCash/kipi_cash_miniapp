"use client";

import { UserCard } from "@/components/UserCard";
import { useSession, signOut } from "next-auth/react";
import {
  CountdownTimerIcon,
  ExitIcon,
  FileTextIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";

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
        <h1 className="text-3xl font-bold">Panel de Trabajo de Cambios</h1>
        {session && (
          <div className="w-52 py-3 px-12 flex flex-row items-end justify-end">
            <div className="relative">
              <UserCard
                session={session}
                options={[
                  {
                    label: "Mi Perfil",
                    icon: <PersonIcon />,
                    onClick: () => {
                      router.replace("/exchanger/info");
                    },
                  },
                  {
                    label: "Todas mis transacciones",
                    icon: <CountdownTimerIcon />,
                    onClick: () => {
                      router.replace("/exchanger/allTransactions");
                    },
                  },
                  {
                    label: "Transacciones Pendientes",
                    icon: <FileTextIcon />,
                    onClick: () => {
                      router.replace("/exchanger");
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
