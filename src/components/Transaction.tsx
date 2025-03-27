"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { cn, getDateHours } from "@/lib/utils";
import { TransactionStatus } from "@/app/types/transactionStatus";
import { TransactionType } from "@/app/types/transaction";
import { TimestampsType } from "@/app/types/timestamp";

import {
  Calendar,
  CirclePlus,
  LoaderPinwheel,
  CircleCheck,
  CircleX,
  TriangleAlert,
  BookmarkCheck,
} from "lucide-react";

const timestampFieldMap: Record<TransactionStatus, keyof TimestampsType> = {
  waitingSS: "createdAt",
  checkingSS: "ssSendAt",
  aproved: "ssResultAt",
  rejected: "ssResultAt",
  finished: "finishedAt",
  qrRejected: "qrRejectedAt",
};

interface TransactionProps {
  transaction: TransactionType;
  onClick: (transaction: TransactionType) => void;
  className?: string;
  selected?: boolean;
}

export const Transaction = ({
  transaction,
  onClick,
  className,
  selected = false,
}: TransactionProps) => {
  return (
    <motion.div
      key={transaction.id}
      initial={{ opacity: 0, y: 1 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "py-4 pr-4 relative bg-kipi",
          selected
            ? "pl-7 bg-kipi-foreground shadow-xl scale-105 transition-transform duration-200 ease-in-out"
            : "pl-8"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-2 rounded-l-lg",
            transaction.status == "waitingSS"
              ? "bg-primary-foreground"
              : transaction.status == "checkingSS"
              ? "border-slate-500 bg-slate-500"
              : transaction.status == "aproved"
              ? "border-emerald-800 bg-emerald-800"
              : transaction.status == "rejected"
              ? "border-red-800 bg-red-800"
              : transaction.status == "finished"
              ? "border-blue-800 bg-blue-800"
              : ""
          )}
        />
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="relative flex-shrink-0"
          >
            <Image
              src={transaction.request.clientImage}
              alt={`Foto de ${transaction.request.clientName}`}
              width={50}
              height={50}
              className={cn(
                "rounded-full object-cover",
                selected && "ring-4 ring-white"
              )}
            />
          </motion.div>
          <div className="flex flex-1 flex-col gap-y-3 lg:gap-y-0 lg:flex-row lg:items-center justify-between">
            <div className="space-y-1">
              <motion.h3
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={cn("text-lg font-semibold", selected && "text-kipi")}
              >
                {transaction.request.clientName}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={cn(
                  "text-sm text-muted-foreground",
                  selected && "text-kipi-secondary"
                )}
              >
                {transaction.request.clientEmail}
              </motion.p>
            </div>
            <div className="flex flex-col items-end gap-1">
              {transaction.status !== undefined && (
                <>
                  <Button
                    variant="outline"
                    className={cn(
                      "font-bold border-kipi-foreground text-kipi hover:scale-105 transition-transform duration-200 ease-in-out",
                      selected
                        ? "bg-kipi text-kipi-foreground"
                        : "bg-gradient-to-b from-[#313644] to-kipi-foreground hover:text-kipi"
                    )}
                    onClick={() => {
                      onClick(transaction);
                    }}
                  >
                    Verificar detalles
                  </Button>
                  <div
                    className={cn(
                      "w-full flex flex-row justify-end gap-x-2",
                      selected && "text-kipi"
                    )}
                  >
                    <TransactionStatusToIcon status={transaction.status} />
                  </div>
                  <div
                    className={cn(
                      "flex flex-row items-center gap-2",
                      selected ? "text-kipi" : "text-kipi-foreground"
                    )}
                  >
                    <TransactionTimestamp
                      date={
                        transaction.timestamps[
                          timestampFieldMap[transaction.status]
                        ]!
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const TransactionStatusToIcon = ({ status }: { status: TransactionStatus }) => {
  switch (status) {
    case "waitingSS":
      return (
        <>
          <span>Creado </span>
          <CirclePlus size={24} />
        </>
      );
    case "checkingSS":
      return (
        <>
          <span>Captura enviada </span>
          <LoaderPinwheel size={24} />
        </>
      );
    case "aproved":
      return (
        <>
          <span>Aprobado </span>
          <CircleCheck size={24} />
        </>
      );
    case "rejected":
      return (
        <>
          <span>Rechazado </span>
          <CircleX size={24} />
        </>
      );
    case "qrRejected":
      return (
        <>
          <span>QR rechazado </span>
          <TriangleAlert size={24} />
        </>
      );
    case "finished":
      return (
        <>
          <span>Finalizado </span>
          <BookmarkCheck size={24} />
        </>
      );
  }
};

const TransactionTimestamp = ({ date }: { date: Date }) => {
  const { date: dateObj, hour } = getDateHours(date);
  return (
    <>
      <span>
        {hour.hours}:{hour.minutes}
      </span>
      <span>
        {dateObj.day}/{dateObj.month}/{dateObj.year}
      </span>
      <Calendar size={24} />
    </>
  );
};

/* const transactionStatusToString = (status: TransactionStatus) => {
  switch (status) {
    case "waitingSS":
      return "Creado";
    case "checkingSS":
      return "Captura enviada";
    case "aproved":
      return "Aprobado";
    case "rejected":
      return "Rechazado";
    case "qrRejected":
      return "QR rechazado";
    case "finished":
      return "Finalizado";
  }
};
 */
