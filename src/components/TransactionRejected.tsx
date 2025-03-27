"use client";
import { RejectReason } from "@/db/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RolType } from "@/app/types/rol";
import { useSession } from "next-auth/react";
import { ImageView } from "@/components/ImageView";

const rejectedDialogs: Record<RolType, Record<RejectReason, string>> = {
  client: {
    falsified: "Tu pago ha sido reportado como falsificado.",
    already_charged: "Este pago ya ha sido cobrado.",
    ss_error: "Ups, detectamos un error en tu comprobante.",
  },
  exchanger: {
    falsified: "Has reportado este pago como falsificado.",
    already_charged: "Este pago ya ha sido cobrado.",
    ss_error: "Has detectado un error en la captura.",
  },
  admin: {
    already_charged: "Admin xd",
    falsified: "Admin wa",
    ss_error: "Wtf q hace esto aqui",
  },
};

const timeBanned = "7 días";

interface TransactionRejectedProps {
  rejectReason: RejectReason;
  imgUrl?: string;
  className?: string;
  onAcceptRejection?: () => void;
  onAcceptBan?: () => void;
}

export const TransactionRejected = ({
  rejectReason,
  imgUrl,
  className,
  onAcceptRejection,
  onAcceptBan,
}: TransactionRejectedProps) => {
  const { data: sesion } = useSession();

  return (
    <div className="w-full flex flex-col items-end gap-4">
      <div className="w-full lg:w-1/2">
        <Card className={cn("p-4", className)}>
          <div className="flex flex-col items-center gap-4">
            <span className="text-md font-bold text-center">
              {rejectedDialogs[sesion?.user.role!][rejectReason]}
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
                  <span className="text-red-500 text-9xl font-extrabold">✕</span>
                </div>
              </div>
            )}
            {rejectReason !== "falsified" ? (
              <>
                {onAcceptRejection && (
                  <>
                    {rejectReason == "ss_error" && <>
                      <p className="text-md font-semibold text-center">
                        Por favor, revisa que la captura de tu pago sea como la del ejemplo:
                      </p>
                      <ImageView
                        src="https://firebasestorage.googleapis.com/v0/b/kipi-cash-7340c.firebasestorage.app/o/kipi-cash%2Fexample-ss%2Fcorrect-ss.jpg?alt=media&token=b76a0935-b41d-4497-9626-020b6443abff"
                        alt="example-ss"
                        smallProps={{
                          width: 300,
                          height: 200,
                          className: "cursor-pointer",
                        }}
                        largeProps={{
                          width: 600,
                          height: 400,
                        }}
                        title="Ejemplo de boucher"
                      />
                    </>}
                    {
                      rejectReason == "already_charged" && sesion?.user.role === "client" && (
                        <p className="text-md font-semibold text-center">
                          Si mandó esta captura por error, puede volver a intentarlo.
                        </p>
                      )
                    }
                    <Button onClick={onAcceptRejection} className="w-full">
                      <span>Volver a intentar</span>
                    </Button>
                  </>
                )}
              </>
            ) : (
              sesion?.user.role === "client" && (
                <>
                  <p className="text-md text-center">
                    Has recibido una inahabilitación temporal.{" "}
                    <span className="text-red-500 font-bold">
                      No podras realizar solicitudes de cambio por {timeBanned}.
                    </span>
                  </p>
                  {onAcceptBan && (
                    <Button onClick={onAcceptBan} className="w-full">
                      <span>Comprendo</span>
                    </Button>
                  )}
                </>
              )
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
