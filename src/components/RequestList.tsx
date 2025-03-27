"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Request } from "@/components/Request";
import { RequestType } from "@/app/types/request";
import { TransactionStatus } from "@/app/types/transactionStatus";

export type RequestWithTransactionStatus = RequestType & {
  transactionStatus?: TransactionStatus;
};

interface RequestProps {
  requestList: RequestWithTransactionStatus[];
  selected?: string;
  onSelect: (registro: RequestType) => void;
}

export const RequestList = ({
  requestList,
  selected,
  onSelect,
}: RequestProps) => {
  return requestList.length > 0 ? (
    <motion.div className="space-y-4">
      <AnimatePresence>
        {requestList.map((request) => (
          <Request
            className={
              request.id === selected
                ? "bg-cyan-950 shadow-xl bg-opacity-5"
                : undefined
            }
            key={request.id}
            request={request}
            status={request.transactionStatus}
            onClick={onSelect}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  ) : (
    <div className="text-center p-8 text-muted-foreground">
      <p>No hay solicitudes pendientes :(</p>
    </div>
  );
};
