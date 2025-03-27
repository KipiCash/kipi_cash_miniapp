"use client";

import { NoiceType } from "@/app/types/noice";
import { StageType } from "@/app/types/stage";
import { TransactionType } from "@/app/types/transaction";
import { Noice } from "@/components/Noice";
import { TabButton } from "@/components/TabButton";
import { Transaction } from "@/components/Transaction";
import { TransactionTimeline } from "@/components/TransactionTimeLine";
import { getTransactionsByExchanger } from "@/db/transaction";
import { stageDialogs } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Page() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [selected, setSelected] = useState<TransactionType | undefined>(
    undefined
  );
  const [stages, setStages] = useState<StageType[]>([]);
  const [noice, setNoice] = useState<NoiceType | null>({
    message: "Cargando las transacciones",
    type: "loading",
    styleType: "page",
  });
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.id) {
        throw new Error("No se ha encontrado el usuario");
      }
      const _transactions = await getTransactionsByExchanger(session?.user?.id);
      return _transactions;
    };

    fetchTransactions().then(
      (transactions) => {
        setTransactions(transactions);
        setNoice(null);
      },
      (error) => {
        setNoice({
          message: "No se han podido cargar las transacciones",
          type: "error",
          styleType: "page",
        });
        console.error(error);
      }
    );
  }, []);

  useEffect(() => {
    if (selected?.status === "rejected" || selected?.status === "qrRejected") {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) =>
            stage !== "finished" && stage !== "aproved" && stage !== "rejected"
        )
      );
    } else if (selected?.timestamps.qrRejectedAt) {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) => stage !== "aproved" && stage !== "rejected"
        )
      );
    } else {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) =>
            stage !== "aproved" &&
            stage !== "rejected" &&
            stage !== "qrRejected"
        )
      );
    }
  }, [selected]);

  const onSelect = (transaction: TransactionType) => {
    setSelected(transactions.find((txn) => txn.id === transaction.id));
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {noice && <Noice noice={noice} />}
      <div className="space-y-4">
        <div className="max-w-2xl mx-auto p-4">
          {/* Tabs */}
          <div className="border-b mb-6">
            <div className="flex space-x-8">
              <TabButton isActive={true} onClick={() => {}}>
                Solicitudes Finalizadas
              </TabButton>
            </div>
          </div>

          {/* List */}
          <motion.div className="space-y-4">
            <AnimatePresence>
              {transactions.map((txn) => (
                <Transaction
                  className={
                    txn.id === selected?.id
                      ? "bg-cyan-950 shadow-xl bg-opacity-5"
                      : undefined
                  }
                  key={txn.id}
                  transaction={txn}
                  onClick={onSelect}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-lg">
        {selected ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Solicitud en Revisión</h2>
            <TransactionTimeline
              currentTransaction={selected}
              stages={stages}
            />
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>Selecciona una transacción para ver más detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
