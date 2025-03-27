"use client";
import React from "react";
import { Button } from "./ui/button";
import { DinamicCard } from "./DinamicCard";
import { ImageView } from "./ImageView";

interface TransactionFinishedProps {
  imgUrl: string;
  message: string;
  className?: string;
}

export const TransactionFinished = ({
  imgUrl,
  message,
  className,
}: TransactionFinishedProps) => {
  return (
    <div className="w-full md:w-1/2">
      <DinamicCard
        message={message}
        className="md:w-full"
        messageClassName="text-left font-semibold"
        defaultOpen={true}
      >
        <div className="flex flex-col items-center gap-4 mt-2">
          <span className="text-md text-center">
            Aquí esta el comprobante del pago
          </span>
          <ImageView
            src={imgUrl}
            alt="Captura de pago"
            smallProps={{
              width: 200,
              height: 200,
              className: "cursor-zoom-in",
            }}
            largeProps={{
              width: 400,
              height: 400,
            }}
          />
          <a
            href={imgUrl}
            download={"Comprobante"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant={"outline"} className="w-full text-wrap">
              Descargar comprobante
            </Button>
          </a>
        </div>
      </DinamicCard>
    </div>
  );
};
