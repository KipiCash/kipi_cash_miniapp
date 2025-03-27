import React from "react";
import Image from "next/image";

interface TransactionAprovedProps {
  message: string;
  clientSSImgUrl: string;
}

export const TransactionAproved = ({
  message,
  clientSSImgUrl,
}: TransactionAprovedProps) => {
  return (
    <>
      <p className="text-base text-center font-bold mb-2">{message}</p>
      <Image
        src={clientSSImgUrl!}
        width={200}
        height={200}
        alt="Captura de pago"
      />
    </>
  );
};
