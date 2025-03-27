"use client";
import { motion, AnimatePresence } from "framer-motion";
import { TransactionType } from "@/app/types/transaction";
import { Transaction } from "@/components/Transaction";

interface TransactionsListProps {
  transactionList: TransactionType[];
  selected?: string;
  onSelect: (transaction: TransactionType) => void;
}

export const TransactionsList = ({
  transactionList,
  selected,
  onSelect,
}: TransactionsListProps) => {
  return transactionList.length > 0 ? (
    <motion.div className="space-y-4">
      <AnimatePresence>
        {transactionList.map((txn) => (
          <Transaction
            selected={txn.id === selected}
            key={txn.id}
            transaction={txn}
            onClick={onSelect}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  ) : (
    <div className="text-center p-8 text-muted-foreground">
      <p>No esta atendiendo ninguna transaccion :(</p>
    </div>
  );
};
