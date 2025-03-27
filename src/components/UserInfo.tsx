"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Session, User } from "next-auth";
import { getUserById } from "@/db/users";
import { RolType } from "@/app/types/rol";
import { Button } from "./ui/button";
import { CopyIcon } from "@radix-ui/react-icons";
import { TransactionStatus } from "@/app/types/transactionStatus";
import { DinamicCard } from "./DinamicCard";

const dialogs: Record<RolType, string> = {
  client: "Ya conectamos tu solicitud con un experto verificado. ",
  exchanger: "Haz sido contactado por ",
  admin: "Esto no debería salir jaja salu2",
};

interface UserInfoProps {
  userId: string;
  transactionStatus: TransactionStatus;
  className?: string;
}
export const UserInfo = ({
  userId,
  className,
  transactionStatus,
}: UserInfoProps) => {
  const [user, serUser] = useState<Session["user"] | null>(null);
  const [clicked, setClicked] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  useEffect(() => {
    const fetchExchanger = async () => {
      try {
        if (!userId) return;
        const _user = await getUserById(userId);
        if (!_user.userId) return;
        serUser({
          ..._user,
          id: _user.userId,
        });
      } catch {}
    };

    fetchExchanger();
  }, [userId]);

  return (
    <div className="w-full md:w-1/2 m-2">
      <motion.div
        key={`${userId}-user-info`}
        initial={{ opacity: 0, y: 1 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-full"
      >
        {transactionStatus === "waitingSS" ? (
          <Card className={cn("p-4", className)}>
            {user ? (
              <>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="items-center flex flex-col gap-2 cursor-pointer"
                >
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg lg:text-lg font-semibold w-full text-center"
                  >
                    {user.role === "client"
                      ? `${dialogs["exchanger"]} ${user.name}`
                      : dialogs["client"]}
                  </motion.h3>
                  {user.role === "exchanger" && (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <motion.h5
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-sm lg:text-lg font-semibold w-full text-center"
                        >
                          Copia la dirección de abajo para completar tu
                          operación.
                        </motion.h5>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1"
                      >
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(user.walletAddress!);
                            setClicked(true);

                            setTimeout(() => {
                              setClicked(false);
                            }, 2000);
                          }}
                          className="w-full"
                        >
                          <CopyIcon />
                          {clicked
                            ? "Copiado!"
                            : `${user.walletAddress!.slice(0, 10)}...`}
                        </Button>
                      </motion.div>
                      <div className="flex flex-col items-center gap-1">
                        <p className="text-sm text-gray-600 mt-2 gap-1 justify-center text-center">
                          ¿No se ha copiado la dirección?{" "}
                        </p>
                        <span
                          className="text-sm font-bold underline hover:scale-105 cursor-pointer transition-transform ease-in-out duration-200"
                          onClick={() => {
                            setShowAddress(!showAddress);
                          }}
                        >
                          {showAddress ? "Ocultar" : "Mostrar"} dirección
                        </span>
                      </div>
                      {showAddress && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="w-full border-r-4 border-l-4 border-kipi-foreground bg-kipi-secondary bg-opacity-35 text-kipi-foreground py-2 flex items-center justify-center gap-1 cursor-text mt-2"
                        >
                          <p>{user.walletAddress!}</p>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              </>
            ) : (
              <LoadingSpinner />
            )}
          </Card>
        ) : user ? (
          <DinamicCard
            message={
              user.role === "client"
                ? `${dialogs["exchanger"]} ${user.name}`
                : dialogs["client"]
            }
            className="md:w-full"
            messageClassName="text-left mb-2"
          >
            {user.role === "exchanger" ? (
              <>
                <span className="font-semibold w-full text-center">
                  Dirección de billetera del experto
                </span>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(user.walletAddress!);
                      setClicked(true);

                      setTimeout(() => {
                        setClicked(false);
                      }, 2000);
                    }}
                    className="w-full"
                  >
                    <CopyIcon />
                    {clicked
                      ? "Copiado!"
                      : `${user.walletAddress!.slice(0, 10)}...`}
                  </Button>
                </motion.div>
                {/*                 <div className="flex flex-col items-center gap-1">
                  <p className="text-sm text-gray-600 mt-2 gap-1 justify-center text-center">
                    ¿No se ha copiado la dirección?{" "}
                  </p>
                  <span
                    className="text-sm font-bold underline hover:scale-105 cursor-pointer transition-transform ease-in-out duration-200"
                    onClick={() => {
                      setShowAddress(!showAddress);
                    }}
                  >
                    {showAddress ? "Ocultar" : "Mostrar"} dirección
                  </span>
                </div>
                {showAddress && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full border-r-4 border-l-4 border-kipi-foreground bg-kipi-secondary bg-opacity-35 text-kipi-foreground py-2 flex items-center justify-center gap-1 cursor-text mt-2"
                  >
                    <p className="w-full text-center overflow-hidden break-words">{user.walletAddress!}</p>
                  </motion.div>
                )} */}
              </>
            ) : (
              user.role === "client" && (
                <>
                  <span className="text-lg lg:text-lg font-semibold w-full text-center">
                    Información del cliente
                  </span>
                  <Image
                    src={user.image!}
                    alt={`Foto de ${user.name}`}
                    width={70}
                    height={70}
                    className="rounded-full object-cover"
                  />
                  <h3 className="font-bold text-lg text-center">{user.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Correo: {user.email}
                  </p>
                </>
              )
            )}
          </DinamicCard>
        ) : (
          <Card className={cn("p-4", className)}>
            <LoadingSpinner />
          </Card>
        )}
      </motion.div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full">
    <svg
      aria-hidden="true"
      className="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);
