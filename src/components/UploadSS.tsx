import React, { useState } from "react";
import { ImageLoader } from "@/components/ImageLoader";
import { ButtonAnimated } from "@/components/ButtonAnimated";
import { cn } from "@/lib/utils";
import { ImageViewButton } from "./ImageViewButton";

interface UploadSSProps {
  handleUploadSS: (base64: string) => void;
}

interface ErrorUpload {
  noSS?: string;
}

export const UploadSS = ({ handleUploadSS }: UploadSSProps) => {
  const [base64, setBase64] = useState<string | null>(null);
  const [error, setError] = useState<ErrorUpload>({});

  const onSend = () => {
    const new_error = {} as ErrorUpload;

    if (!base64) {
      new_error.noSS = "No se ha subido la captura del pago";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    handleUploadSS(base64!);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <p className="text-base font-semibold text-gray-800">
        Suba la captura de pantalla de su boucher de pago
      </p>
      <ImageViewButton
        buttonText="Ver ejemplo"
        buttonClassName="w-1/4 my-4 bg-white text-gray-800 hover:bg-gray-100"
        src="https://firebasestorage.googleapis.com/v0/b/kipi-cash-7340c.firebasestorage.app/o/kipi-cash%2Fexample-ss%2Fcorrect-ss.jpg?alt=media&token=b76a0935-b41d-4497-9626-020b6443abff"
        alt="Ejemplo de captura de pantalla"
        title="Ejemplo de captura de pantalla"
        imageProps={{
          width: 400,
          height: 300,
        }}
      />
      <ImageLoader
        setBase64={(base64) => {
          setBase64(base64);
        }}
        classNameBox={cn(error.noSS ? "border-red-800" : "border-white")}
        classNameText={cn(error.noSS ? "text-red-600" : "text-white")}
      />
      {error.noSS && <p className="text-red-600 text-sm">{error.noSS}</p>}
      <ButtonAnimated
        onClick={onSend}
        text="Enviar"
        variant="default"
        className="w-1/4 my-4"
      />
    </div>
  );
};
