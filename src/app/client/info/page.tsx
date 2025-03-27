"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Pencil1Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ImageLoader } from "@/components/ImageLoader";
import { cn } from "@/lib/utils";
import { NoiceType } from "@/app/types/noice";
import { Noice } from "@/components/Noice";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { ButtonAnimated } from "@/components/ButtonAnimated";
import { updateUser } from "@/db/users";

interface ErrorChange {
  noSS?: string;
}

export default function Page() {
  const { data: session } = useSession();

  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [base64, setBase64] = useState<string | null>(null);
  const [error, setError] = useState<ErrorChange>({});
  const [noice, setNoice] = useState<NoiceType | null>(null);

  useEffect(() => {
    if ((error.noSS && base64) || !onEdit) {
      setError({});
    }
  }, [base64, onEdit]);

  const onUpdate = async () => {
    const new_error = {} as ErrorChange;

    if (!base64) {
      new_error.noSS = "No se ha subido su QR de Yape";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    setNoice({
      type: "loading",
      message: "Actualizando QR...",
      styleType: "modal",
    });

    try {
      if (!session) throw new Error("No hay sesión activa");

      const storageRef = ref(storage, `kipi-cash/qr/${session.user.id}-qr.png`);
      await uploadString(storageRef, base64!, "data_url");
      const qrImgUrl = await getDownloadURL(storageRef);
      await updateUser({
        userId: session.user.id,
        role: session.user.role!,
        qrImgUrl,
      });

      setNoice({
        type: "success",
        message: "QR actualizado correctamente",
        styleType: "modal",
      });

      await new Promise<void>((resolve) => {
        setTimeout(() => {
          window.location.reload();
          setNoice(null);
          setOnEdit(false);
          resolve();
        }, 2000);
      });
    } catch (error) {
      console.error(error);
      setNoice({
        type: "error",
        message: "Ha ocurrido un error al actualizar el QR",
      });
    }
  };

  return (
    <div className="w-full p-4">
      {noice && <Noice noice={noice} />}
      <span className="text-2xl font-bold">Información del Cliente</span>
      <div className="grid md:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-full md:w-2/3">
              <span className="text-lg font-bold self-start ml-4">Nombre</span>
              <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 rounded-full" />
            </div>
            <span className="text-lg ml-6">{session?.user.name}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full md:w-2/3">
              <span className="text-lg font-bold self-start ml-4">Correo</span>
              <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 rounded-full" />
            </div>
            <span className="text-lg ml-6">{session?.user.email}</span>
          </div>
        </div>

        {session?.user.role === "client" && session.user.qrImgUrl && (
          <div className="w-full flex flex-col">
            <div className="flex justify-between">
              <span className="text-lg font-bold ml-4">QR de Yape</span>
              <div className="mr-8 md:w-1/2">
                <div
                  className="relative group inline-block cursor-pointer"
                  onClick={() => setOnEdit(true)}
                >
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-900 bg-opacity-95 text-white text-sm px-2 py-1 rounded opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    Editar
                  </span>
                  <Pencil1Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="h-1 bg-slate-900 bg-opacity-85 mr-6 my-2 rounded-full md:w-1/2" />
            {!onEdit ? (
              <Image
                src={session?.user.qrImgUrl}
                alt="QR de Yape"
                width={350}
                height={350}
                className="rounded-lg ml-6"
              />
            ) : (
              <div className="flex flex-col items-center mx-6">
                <p className="text-lg font-bold text-gray-800">
                  Adjunte su nuevo QR de Yape
                </p>
                <ImageLoader
                  setBase64={(base64) => {
                    setBase64(base64);
                  }}
                  classNameBox={cn(
                    error.noSS ? "border-red-800" : "border-white"
                  )}
                  classNameText={cn(error.noSS ? "text-red-600" : "text-white")}
                />
                {error.noSS && (
                  <p className="text-red-600 text-sm">{error.noSS}</p>
                )}
                <div className="grid md:grid-cols-2 w-full px-12 md:p-0 md:w-1/2 gap-4 mt-4">
                  <ButtonAnimated
                    variant="default"
                    onClick={onUpdate}
                    text="Guardar"
                    className="hover:bg-green-500 bg-green-900 text-white"
                  />
                  <ButtonAnimated
                    variant="destructive"
                    text="Cancelar"
                    onClick={() => {
                      setOnEdit(false);
                      setBase64(null);
                    }}
                    className="bg-red-500 text-white"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
