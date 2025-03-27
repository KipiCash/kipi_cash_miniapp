"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { motion } from "framer-motion";
import { Noice } from "@/components/Noice";

import { NoiceType } from "@/app/types/noice";
import { RolType } from "@/app/types/rol";

import { cn } from "@/lib/utils";
import { ImageLoader } from "@/components/ImageLoader";
import { User } from "@/db/types";
import { updateUser } from "@/db/users";

interface ErrorRol {
  noSS?: string;
}

export default function Page() {
  const { data: session } = useSession();
  const [noice, setNoice] = useState<NoiceType | null>(null);
  const [error, setError] = useState<ErrorRol>({});
  const [base64, setBase64] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (base64) {
      setError((prev) => ({ ...prev, noSS: undefined }));
    }
  }, [base64]);

  const uploadQr = async () => {
    const new_error = {} as ErrorRol;

    if (!base64) {
      new_error.noSS = "No se ha subido su QR de Yape";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    setNoice({
      type: "loading",
      message: "Actualizando tu QR...",
      styleType: "modal",
    });

    if (session) {
      try {
        const uploader = {} as {
          role: RolType;
          qrImgUrl?: string;
        };

        uploader.role = "client";

        if (base64) {
          const storageRef = ref(
            storage,
            `kipi-cash/qr/${session.user.id}-qr.png`
          );
          await uploadString(storageRef, base64, "data_url");
          uploader.qrImgUrl = await getDownloadURL(storageRef);
        }

        const docRef = doc(db, "users", session.user.id);
        await setDoc(docRef, uploader, { merge: true });
        session.user.role = "client";

        const user: User = {
          userId: session.user.id,
          email: session.user.email!,
          image: session.user.image!,
          name: session.user.name!,
          banUntil: null,
          role: "client",
        };

        user.qrImgUrl = uploader.qrImgUrl!;
        session.user.qrImgUrl = uploader.qrImgUrl!;

        updateUser(user);

        setNoice({
          type: "success",
          message: "QR subido correctamente.",
          styleType: "modal",
        });

        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
            setNoice(null);
            router.replace(`/client`);
          }, 2000);
        });
      } catch (e) {
        setNoice({ type: "error", message: "Error al subir su QR" });
        console.error(e);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      {noice && <Noice noice={noice} />}
      <h1 className="text-3xl font-bold">Adjunte su QR de Yape</h1>

      <div className="flex flex-col items-center">
        <ImageLoader
          setBase64={(base64) => {
            setBase64(base64);
          }}
          classNameBox={cn(error.noSS ? "border-red-800" : "border-white")}
          classNameText={cn(error.noSS ? "text-red-600" : "text-white")}
        />
        {error.noSS && <p className="text-red-600 text-sm">{error.noSS}</p>}
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
        onClick={() => uploadQr()}
      >
        Continuar
      </motion.div>
    </div>
  );
}
