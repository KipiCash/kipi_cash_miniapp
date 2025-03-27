"use client"

import { TransactionType } from "@/app/types/transaction"
import { getAllTransactionsDebug } from "@/db/transaction"
import { useEffect, useState } from "react"

export const TestDebug = () => {

  const [debugTransactions, setDebugTransactions] = useState<TransactionType[]>([])

  useEffect(() => {
    getAllTransactionsDebug().then((transactions) => {
      setDebugTransactions(transactions)
    })
  }, [])

  useEffect(() => {
    console.log(debugTransactions)
  }, [debugTransactions])

  return (
    <div>tDebug</div>
  )
}