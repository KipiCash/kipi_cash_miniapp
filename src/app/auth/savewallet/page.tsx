"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import { motion } from "framer-motion";
import { Noice } from "@/components/Noice";

import { NoiceType } from "@/app/types/noice";
import { RolType } from "@/app/types/rol";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { User } from "@/db/types";
import { updateUser } from "@/db/users";

interface ErrorRol {
  noSelected?: string;
  noSS?: string;
  noWal?: string;
}

export default function Page() {
  const { data: session } = useSession();
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const [error, setError] = useState<ErrorRol>({});
  const [wallet, setWallet] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (wallet) {
      setError((prev) => ({ ...prev, noWal: undefined }));
    }
  }, [wallet]);

  const saveWallet = async () => {
    const new_error = {} as ErrorRol;

    if (!wallet) {
      new_error.noWal = "Debe ingresar su dirección de billetera";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    setNoice({
      type: "loading",
      message: "Guardando su dirección de billetera...",
      styleType: "modal",
    });

    if (session) {
      try {
        const uploader = {} as {
          role: RolType;
          walletAddress?: string;
        };

        uploader.role = "exchanger";

        if (wallet) {
          uploader.walletAddress = wallet;
        }

        const docRef = doc(db, "users", session.user.id);
        await setDoc(docRef, uploader, { merge: true });
        session.user.role = "exchanger";

        const user: User = {
          userId: session.user.id,
          email: session.user.email!,
          image: session.user.image!,
          name: session.user.name!,
          banUntil: null,
          role: "exchanger",
        };

        user.walletAddress = uploader.walletAddress!;
        session.user.walletAddress = uploader.walletAddress!;

        updateUser(user);

        setNoice({
          type: "success",
          message: "Rol actualizado correctamente.",
          styleType: "modal",
        });

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
            setNoice(null);
            router.replace(`/exchanger`);
          }, 2000);
        });
      } catch (e) {
        setNoice({ type: "error", message: "Error al guardar su billetera." });
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {noice && <Noice noice={noice} />}
      <h1 className="text-3xl font-bold">Adjunte su dirección de billetera</h1>

      <div className="flex flex-col items-center">
        <Input
          type="text"
          value={wallet || ""}
          onChange={(e) => setWallet(e.target.value)}
          className="px-4 py-2 border rounded-md w-full"
          placeholder="Dirección de billetera"
        />
        {error.noWal && <p className="text-red-600 text-sm">{error.noWal}</p>}
      </div>

      <motion.div
        variants={{
          initial: { scale: 1, backgroundColor: "rgb(15 23 42)" },
          hover: {
            scale: 1.05,
            transition: { type: "spring", stiffness: 400, damping: 17 },
            backgroundColor: "#040508",
          },
        }}
        initial="initial"
        whileHover="hover"
        className={cn(
          "px-4 py-2 rounded-md w-full cursor-pointer border  text-white"
        )}
        onClick={() => saveWallet()}
      >
        Continuar
      </motion.div>
    </div>
  );
}
