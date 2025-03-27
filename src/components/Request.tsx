"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { cn, formatDate } from "@/lib/utils";
import { RequestType } from "@/app/types/request";
import { TransactionStatus } from "@/app/types/transactionStatus";

interface RequestProps {
  request: RequestType;
  status?: TransactionStatus;
  onClick: (request: RequestType) => void;
  className?: string;
}

export const Request = ({
  request,
  status,
  onClick,
  className,
}: RequestProps) => {
  return (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative flex-shrink-0"
          >
            <Image
              src={request.clientImage}
              alt={`Foto de ${request.clientName}`}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
          </motion.div>
          <div className="flex flex-1 flex-col gap-y-3 lg:gap-y-0 lg:flex-row lg:items-center justify-between">
            <div className="space-y-1">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg font-medium"
              >
                {request.clientName}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-muted-foreground"
              >
                {request.clientEmail}
              </motion.p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {status == undefined ? (
                <>
                  <Button
                    variant="outline"
                    className="transition-transform hover:scale-105"
                    onClick={() => {
                      onClick(request);
                    }}
                  >
                    Atender
                  </Button>
                  <h3>{"Creado a las " + formatDate(request.createdAt)}</h3>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className={`transition-transform hover:scale-105 ${
                      status == "waitingSS"
                        ? "bg-primary-foreground text-primary-background"
                        : status == "checkingSS"
                        ? "border-slate-800 text-slate-800 hover:border-slate-600 hover:text-slate-600"
                        : status == "aproved"
                        ? "border-emerald-800 text-emerald-800 hover:border-emerald-600 hover:text-emerald-600"
                        : status == "rejected"
                        ? "border-red-800 text-red-800 hover:border-red-600 hover:text-red-600"
                        : status == "finished"
                        ? "border-blue-800 text-blue-800 hover:border-blue-600 hover:text-blue-600"
                        : ""
                    }`}
                    onClick={() => {
                      onClick(request);
                    }}
                  >
                    Verificar detalles
                  </Button>
                  <h3>
                    {transactionStatusToString(status) +
                      " el " +
                      formatDate(request.createdAt)}
                  </h3>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const transactionStatusToString = (status: TransactionStatus) => {
  switch (status) {
    case "waitingSS":
      return "Creado";
    case "checkingSS":
      return "Captura enviada";
    case "aproved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
    case "finished":
      return "Finalizado";
  }
};
