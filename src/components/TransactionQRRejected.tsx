"use client";
import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { RolType } from "@/app/types/rol";
import { ImageView } from "./ImageView";
import { TriggableModal } from "./TriggableModal";
import { ImageLoader } from "./ImageLoader";
import { ButtonAnimated } from "./ButtonAnimated";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Image from "next/image";
const dialogByRol: Record<RolType, string> = {
  client: "Tu QR ha sido detectado como incorrecto.",
  exchanger: "Esperando que el cliente envíe un QR válido.",
  admin: "Admin xd",
};

interface TransactionQRRejectedProps {
  imgUrl?: string;
  className?: string;
  onCorrectQR?: (base64: string) => void;
}

interface ErrorUpload {
  noSS?: string;
}

export default function TransactionQRRejected({
  imgUrl,
  className,
  onCorrectQR,
}: TransactionQRRejectedProps) {
  const { data: sesion } = useSession();
  const [base64, setBase64] = useState<string | null>(null);
  const [error, setError] = useState<ErrorUpload>({});
  const isSmall = useMediaQuery("(max-width: 640px)");

  const onSend = () => {
    const new_error = {} as ErrorUpload;

    if (!base64) {
      new_error.noSS = "No se ha adjuntado su QR de Yape";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    if (onCorrectQR) onCorrectQR(base64!);
  };

  return (
    <div className="w-full flex flex-col items-start gap-4">
      <div className="w-full lg:w-1/2">
        <Card className={cn("p-4", className)}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-md font-bold text-center">
              {dialogByRol[sesion?.user.role!]}
            </span>
            {imgUrl && (
              <div className="relative inline-block">
                <ImageView
                  src={imgUrl}
                  alt="Captura de pago"
                  smallProps={{
                    width: 200,
                    height: 200,
                    className: "cursor-zoom-in border-4 border-red-500",
                  }}
                  largeProps={{
                    width: 400,
                    height: 400,
                    className: "cursor-zoom-in border-4 border-red-500",
                  }}
                  title="Imagen rechazada"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <span className="text-red-500 text-9xl font-extrabold">
                    ✕
                  </span>
                </div>
              </div>
            )}
            {sesion?.user.role === "client" && (
              <div className="w-full flex flex-col items-center">
                <p className="text-md text-center">
                  Haz click en el siguiente boton para actualizar tu QR de Yape:
                </p>
                <TriggableModal
                  message="Corregir QR"
                  classNameTrigger="w-full text-center font-bold mt-4 bg-emerald-700 text-white p-2 rounded-lg cursor-pointer hover:bg-emerald-800 hover:scale-105 transition-transform"
                  onClose={() => {
                    setBase64(null);
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Suba su QR de yape!
                    </p>
                    <span className="text-sm text-gray-600">
                      Verifique que este correcto
                    </span>

                    <ImageLoader
                      messageBox="Presiona aquí para subir su QR de Yape"
                      setBase64={(base64) => {
                        setBase64(base64);
                      }}
                      classNameBox={cn(
                        error.noSS ? "border-red-800" : "border-white"
                      )}
                      classNameText={cn(
                        error.noSS ? "text-red-600" : "text-white"
                      )}
                      imgView={!isSmall}
                    />

                    {isSmall && base64 && (
                      <div className="max-h-32 overflow-y-auto">
                        <div className="flex items-center justify-center">
                          <Image
                            src={base64}
                            alt="imagen"
                            width={200}
                            height={200}
                            className=""
                          />
                        </div>
                      </div>
                    )}

                    {error.noSS && (
                      <p className="text-red-600 text-sm">{error.noSS}</p>
                    )}

                    {onCorrectQR && (
                      <ButtonAnimated
                        onClick={onSend}
                        text="Enviar"
                        variant="default"
                        className="w-1/4 my-4"
                      />
                    )}
                  </div>
                </TriggableModal>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
