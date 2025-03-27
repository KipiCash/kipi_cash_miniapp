import React from "react";
import Image from "next/image";
import { ButtonAnimated } from "@/components/ButtonAnimated";
import { TransactionStatus } from "@/app/types/transactionStatus";
import { TransactionType } from "@/app/types/transaction";
import { RejectReason } from "@/db/types";

const actions = [
  { action: "rejected", rejectReason: "falsified", text: "Falsificado" },
  { action: "rejected", rejectReason: "already_charged", text: "Pago ya cobrado" },
  { action: "rejected", rejectReason: "ss_error", text: "Error en la captura" },
  { action: "aproved", text: "Aceptar" },
] as { action: TransactionStatus; rejectReason?: RejectReason; text: string }[];

interface CheckSSProps {
  handleVerification: (action: TransactionStatus, rejectReason?: RejectReason) => void;
  selectedTransaction: TransactionType;
}

export const CheckSS = ({ selectedTransaction, handleVerification }: CheckSSProps) => {
  return (
    <>
      <div className="relative aspect-video w-full">
        <Image
          src={selectedTransaction.clientSSImgUrl!}
          alt="Captura de pago"
          fill
          className="object-contain rounded-lg"
        />
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="grid grid-cols-3 gap-2">
          {actions
            .filter((a) => a.action === "rejected")
            .map(({ action, rejectReason, text }, index) => (
              <ButtonAnimated
                key={index}
                className="border-red-800 text-red-800 hover:border-red-600 hover:text-red-600 hover:bg-white"
                text={text}
                variant="outline"
                onClick={() => handleVerification(action, rejectReason)}
              />
            ))}
        </div>
        {actions
          .filter((a) => a.action === "aproved")
          .map(({ action, text }, index) => (
            <ButtonAnimated
              key={index}
              className="bg-emerald-800 text-white hover:bg-emerald-600 hover:text-white"
              text={text}
              variant="outline"
              onClick={() => handleVerification(action)}
            />
          ))}
      </div>
    </>
  );
};
