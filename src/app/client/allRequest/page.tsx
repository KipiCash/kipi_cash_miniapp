"use client";

import { useEffect, useState } from "react";

import { TabButton } from "@/components/TabButton";
import { TransactionTimeline } from "@/components/TransactionTimeLine";
import { AnimatePresence, motion } from "framer-motion";

import { StageType } from "@/app/types/stage";
import { TransactionType } from "@/app/types/transaction";

import { stageDialogs } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { getTransactionsByClient } from "@/db/transaction";
import { Transaction } from "@/components/Transaction";

export default function Page() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [selected, setSelected] = useState<TransactionType | undefined>(
    undefined
  );
  const [stages, setStages] = useState<StageType[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.id) {
        throw new Error("No se ha encontrado el usuario");
      }
      const _transactions = await getTransactionsByClient(session?.user?.id);
      return _transactions;
    };

    fetchTransactions().then(
      (transactions) => setTransactions(transactions),
      (error) => console.error(error)
    );
  }, []);

  const onSelect = (transaction: TransactionType) => {
    setSelected(transactions.find((txn) => txn.id === transaction.id));
  };

  useEffect(() => {
    if (selected?.status === "rejected") {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) =>
            stage !== "finished" && stage !== "aproved" && stage !== "rejected"
        )
      );
    } else {
      setStages(
        (Object.keys(stageDialogs) as StageType[]).filter(
          (stage) => stage !== "aproved" && stage !== "rejected"
        )
      );
    }
  }, [selected]);

  return (
    <div className="grid lg:grid-cols-2 gap-4">
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
            <h2 className="text-2xl font-bold">Detalles</h2>
            <div className="w-full">
              <TransactionTimeline
                stages={stages}
                currentTransaction={selected}
              />
            </div>
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
