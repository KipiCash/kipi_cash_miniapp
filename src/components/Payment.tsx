import React, { useEffect, useState } from "react";

import { ButtonAnimated } from "@/components/ButtonAnimated";
import { ImageLoader } from "@/components/ImageLoader";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { TriangleAlert } from "lucide-react";
interface PaymentProps {
  qrCode: string;
  handlePayment: (payment: {
    changeAmount: number;
    finalAmount: number;
    ssPaid: string;
  }) => void;
  applyCommission: (initialAmount: number) => Promise<number>;
  handleQRRejected: () => void;
}

interface ErrorPayment {
  noAmount?: string;
  noSS?: string;
}

export const Payment = ({
  qrCode,
  handlePayment,
  applyCommission,
  handleQRRejected,
}: PaymentProps) => {
  const [receivedAmount, setReceivedAmount] = useState(0); // Cambiado a número
  const [finalAmount, setFinalAmount] = useState(0); // Cambiado a número
  const [error, setError] = useState<ErrorPayment>({});
  const [ssPaid, setSsPaid] = useState<string | null>(null);

  useEffect(() => {
    // Resetear los estados cuando qrCode cambie
    setReceivedAmount(0);
    setFinalAmount(0);
    setSsPaid(null);
    setError({});
  }, [qrCode, applyCommission]);

  useEffect(() => {
    const calculateFinalAmount = async (amount: number): Promise<number> => {
      if (amount <= 0) return 0; // Retorna 0 si la cantidad es inválida

      const final = await applyCommission(amount);
      return final < 0 ? 0 : final;
    };

    calculateFinalAmount(receivedAmount).then((final) => setFinalAmount(final));
  }, [receivedAmount, applyCommission, qrCode]);

  useEffect(() => {
    if (receivedAmount > 0) {
      setError((prev) => ({ ...prev, noAmount: undefined }));
    }

    if (ssPaid) {
      setError((prev) => ({ ...prev, noSS: undefined }));
    }
  }, [receivedAmount, ssPaid]);

  const onSubmitted = async () => {
    const new_error = {} as ErrorPayment;

    if (receivedAmount <= 0) {
      new_error.noAmount = "No se ha ingresado una cantidad válida";
    }

    if (!ssPaid) {
      new_error.noSS = "No se ha subido la captura del pago";
    }

    if (Object.keys(new_error).length > 0) {
      setError(new_error);
      return;
    }

    handlePayment({
      changeAmount: receivedAmount,
      finalAmount,
      ssPaid: ssPaid!,
    });
  };

  return (
    <>
      <div className="space-y-2">
        <label
          className={cn(
            "text-sm font-medium",
            error.noAmount ? "text-red-800" : ""
          )}
        >
          Cantidad recibida (S/):
        </label>
        <Input
          type="number"
          className={cn(error.noAmount ? "text-red-800 border-red-800" : "")}
          value={receivedAmount}
          onChange={(e) => setReceivedAmount(Number(e.target.value) || 0)} // Conversión a número
          placeholder="Ingrese la cantidad"
        />
        {error.noAmount && (
          <p className="text-red-600 text-sm">{error.noAmount}</p>
        )}
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="font-medium">
          Cantidad a depositar: S/ {finalAmount.toFixed(2)}
        </p>
      </div>

      <div className="relative aspect-square w-full max-w-[300px] mx-auto">
        <Image src={qrCode} alt="QR de pago" fill className="object-contain" />
      </div>

      <Button
        onClick={handleQRRejected}
        variant={"destructive"}
        className="bg-red-700 hover:bg-red-600 hover:scale-105 transition-transform ease-in-out duration-300"
      >
        <div className="w-full md:w-1/4 flex items-center justify-center gap-2 text-white font-bold ">
          <TriangleAlert size={24} />
          <span>QR NO VALIDO</span>
        </div>
      </Button>
      <div className="space-y-2">
        <ImageLoader
          setBase64={(base64) => {
            setSsPaid(base64);
          }}
          classNameBox={cn(error.noSS ? "border-red-800" : "border-white")}
          classNameText={cn(error.noSS ? "text-red-600" : "text-white")}
        />
        {error.noSS && <p className="text-red-600 text-sm">{error.noSS}</p>}
      </div>

      <div className="flex flex-col items-center w-full lg:w-3/4 mx-auto">
        <ButtonAnimated
          className="w-full"
          text="Finalizar"
          variant="outline"
          onClick={onSubmitted}
        />
      </div>
    </>
  );
};
