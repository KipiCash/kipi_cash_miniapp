"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { NoiceType } from "@/app/types/noice";
import { useState } from "react";
import { Noice } from "@/components/Noice";

export default function Page() {
  const [noice, setNoice] = useState<NoiceType | null>(null);

  const onLogin = async () => {
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      setNoice({
        type: "error",
        message: "Ocurrio un error al iniciar sesion",
        styleType: "page",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {noice && <Noice noice={noice} />}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-3">
          <h1 className="flex items-center text-2xl font-extrabold dark:text-white">
            Kipi
            <span className="bg-slate-900 text-white text-2xl font-bold me-2 px-2.5 py-0.5 rounded-lg dark:bg-blue-200 ms-2">
              Cash
            </span>
          </h1>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Bienvenido a KipiCash
        </h1>
        <p className="text-gray-600 mt-2 text-center">
          Inicia sesión para comenzar a cambiar divisas
        </p>
      </div>

      <motion.div
        variants={{
          initial: { scale: 1 },
          hover: {
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 17 },
            backgroundColor: "#f3f4f6",
          },
          tap: { scale: 0.98 },
        }}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="text-black flex cursor-pointer h-auto w-64 items-center justify-center rounded-md border border-gray-300 px-4 py-2"
        onClick={async () => await onLogin()}
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google logo"
          width={20}
          height={20}
        />
        <span>Acceder con Google</span>
      </motion.div>
    </div>
  );
}
