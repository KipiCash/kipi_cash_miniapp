"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { RequestList } from "@/components/RequestList";
import { CheckSS } from "@/components/CheckSS";
import { Payment } from "@/components/Payment";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WaitSSIcon from "@/components/icons/WaitSSIcon";
import UnselectTransactionIcon from "@/components/icons/UnselectTransaction";

import { TransactionStatus } from "@/app/types/transactionStatus";
import { TransactionType } from "@/app/types/transaction";
import { RequestType } from "@/app/types/request";
import { dataToRequestDB, RequestDBtoFront, updateRequest } from "@/db/request";

import { NoiceType } from "../types/noice";
import { Noice } from "@/components/Noice";
import { PartialTransaction, RejectReason } from "@/db/types";
import {
  getTransactionsByExchanger,
  createTransaction,
  updateTransaction,
  transactionDBtoFront,
  dataToTransactionDB,
} from "@/db/transaction";
import { getUserById } from "@/db/users";
import { db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/navigation";
import { TransactionsList } from "@/components/TransactionList";
import { TabButton } from "@/components/TabButton";
import { banUser } from "@/db/bans";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getConfig } from "@/db/config";
import COLLECTIONS from "@/db/collections";
import { Label } from "@/components/ui/label";

export default function WorkerView() {
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionType | null>(null);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const { data: session } = useSession();
  const [noice, setNoice] = useState<NoiceType | null>({
    type: "loading",
    message: "Obteniendo las solicitudes...",
    styleType: "page",
  });
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [typeTransactionList, setTypeTransactionList] = useState<
    "pending" | "inProgress"
  >("inProgress");

  const [selectedTransactionFilters, setSelectedTransactionFilters] = useState<
    string[]
  >([]);

  const [requestNotificationsCount, setRequestNotificationsCount] = useState(0);
  const [transactionNotificationsCount, setTransactionNotificationsCount] =
    useState(0);

  const router = useRouter();

  const statusOrder = {
    checkingSS: 1,
    qrRejected: 2,
    aproved: 3,
    waitingSS: 4,
    rejected: 5,
    finished: 6,
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.user?.id) {
        throw new Error("No se ha encontrado el usuario");
      }
      const _transactions = await getTransactionsByExchanger(session?.user?.id);
      return _transactions;
    };

    const fetchInit = async () => {
      try {
        setNoice({
          type: "loading",
          message: "Obteniendo sus transacciones...",
          styleType: "page",
        });

        const _transactions = await fetchTransactions();
        setTransactions(_transactions);

        setNoice(null);
      } catch {
        setNoice({
          type: "error",
          message: "No se pudo obtener la información del usuario",
          styleType: "page",
        });
      }
    };
    fetchInit();

    return () => {
      setRequests([]);
      setTransactions([]);
    };
  }, [session?.user?.id]);

  useEffect(() => {
    const requestQuery = query(collection(db, COLLECTIONS.REQUESTS));
    const unsub = onSnapshot(requestQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          if (change.doc.data().status === "pending") {
            const request = await RequestDBtoFront(
              dataToRequestDB(change.doc.data(), change.doc.id)
            );
            setRequests((prev) => [...prev, request]);
          }
        } else if (change.type === "modified") {
          const request = await RequestDBtoFront(
            dataToRequestDB(change.doc.data(), change.doc.id)
          );
          setRequests((prev) =>
            prev.map((r) => (r.id === request.id ? request : r))
          );
        } else if (change.type === "removed") {
          setRequests((prev) => prev.filter((r) => r.id !== change.doc.id));
        }
      });
    });
    return unsub;
  }, []);

  useEffect(() => {
    const transactionsQuery = query(
      collection(db, COLLECTIONS.TRANSACTIONS),
      where("workerId", "==", session?.user?.id)
    );
    const unsub = onSnapshot(transactionsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "modified") {
          const transaction = await transactionDBtoFront(
            dataToTransactionDB(change.doc.data(), change.doc.id)
          );
          if (
            transaction.status === "checkingSS" ||
            (transaction.status === "aproved" &&
              transaction.timestamps.qrRejectedAt)
          ) {
            setTransactions((prev) =>
              prev.map((t) => (t.id === transaction.id ? transaction : t))
            );
            if (selectedTransaction?.id === transaction.id) {
              setSelectedTransaction(transaction);
            }
          }
        }
      });
    });
    return () => unsub();
  }, [selectedTransaction, transactions, session?.user?.id]);

  useEffect(() => {
    if (
      selectedTransaction?.status === "aproved" ||
      selectedTransaction?.status === "qrRejected"
    ) {
      getUserById(selectedTransaction.request.clientId).then((client) => {
        setQrCode(client.qrImgUrl!);
      });
    }
  }, [selectedTransaction]);

  useEffect(() => {
    if (selectedTransactionFilters.length === 0) {
      return;
    }
    if (
      !selectedTransactionFilters.some((f) => f === selectedTransaction?.status)
    ) {
      setSelectedTransaction(null);
    }
  }, [selectedTransactionFilters, selectedTransaction]);

  useEffect(() => {
    setRequestNotificationsCount(
      requests.filter((r) => r.status === "pending").length
    );
    setTransactionNotificationsCount(
      transactions.filter(
        (t) =>
          t.status === "checkingSS" ||
          (t.status === "aproved" && t.timestamps.qrRejectedAt)
      ).length
    );
  }, [requests, transactions]);

  const handleVerification = (
    action: TransactionStatus,
    rejectReason?: RejectReason
  ) => {
    if (!selectedTransaction) {
      throw new Error("No transaction selected");
    }

    const partialUpdateTransaction: PartialTransaction = {
      id: selectedTransaction.id,
      status: action,
      timestamps: {
        ...selectedTransaction.timestamps,
        ssResultAt: new Date(),
      },
    };

    if (rejectReason && action === "rejected") {
      partialUpdateTransaction.rejectReason = rejectReason;
    }

    if (action === "aproved" || action === "rejected") {
      updateTransaction(partialUpdateTransaction);
    } else {
      throw new Error("Invalid action");
    }

    setTransactions((prevTransactions) =>
      prevTransactions.map((t) =>
        t.id === partialUpdateTransaction.id
          ? {
              ...t,
              ...partialUpdateTransaction,
            }
          : t
      )
    );
    setSelectedTransaction({
      ...selectedTransaction,
      ...partialUpdateTransaction,
    });

    if (action === "rejected") {
      setSelectedTransaction(null);
      if (rejectReason === "falsified") {
        banUser({
          userId: selectedTransaction.request.clientId,
          banUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        });
      } else {
        createTransactionOfRequest(
          {
            ...selectedTransaction,
            ...partialUpdateTransaction,
          }.request
        );
      }
    }
  };

  const applyCommission = async (initialAmount: number) => {
    const config = await getConfig();
    if (config.commission.commissionType === "percentage") {
      return (
        initialAmount -
        (initialAmount * config.commission.commissionAmount) / 100
      );
    } else if (config.commission.commissionType === "fixed") {
      return initialAmount - config.commission.commissionAmount;
    } else {
      throw new Error("Invalid commission type");
    }
  };

  const handlePayment: (payment: {
    changeAmount: number;
    finalAmount: number;
    ssPaid: string;
  }) => void = async (payment) => {
    if (!selectedTransaction) {
      throw new Error("No transaction selected");
    }

    const storageRef = ref(
      storage,
      `kipi-cash/payment-ss/${selectedTransaction.id}-payment-ss.png`
    );
    await uploadString(storageRef, payment.ssPaid, "data_url");
    const ssImgUrl = await getDownloadURL(storageRef);

    const partialUpdateTransaction: PartialTransaction = {
      id: selectedTransaction.id,
      status: "finished",
      timestamps: {
        ...selectedTransaction.timestamps,
        finishedAt: new Date(),
      },
      clientId: selectedTransaction.request.clientId,
      changeAmount: payment.changeAmount,
      finalAmount: payment.finalAmount,
      responseSSImgUrl: ssImgUrl,
    };

    await updateTransaction(partialUpdateTransaction);

    setNoice({
      type: "success",
      message: "Transacción finalizada!",
      styleType: "modal",
    });

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        setTransactions((prev) =>
          prev.filter((t) => t.id !== partialUpdateTransaction.id)
        );
        setSelectedTransaction(null);
        router.replace(`/${session?.user?.role}`);
        setNoice(null);
        resolve();
      }, 3000);
    });
  };

  const handleQRRejected = async () => {
    if (!selectedTransaction) {
      throw new Error("No transaction selected");
    }

    const partialUpdateTransaction: PartialTransaction = {
      id: selectedTransaction.id,
      status: "qrRejected",
      timestamps: {
        ...selectedTransaction.timestamps,
        qrRejectedAt: new Date(),
      },
    };

    await updateTransaction(partialUpdateTransaction);

    setTransactions((prev) =>
      prev.map((t) =>
        t.id === partialUpdateTransaction.id
          ? {
              ...t,
              ...partialUpdateTransaction,
            }
          : t
      )
    );
    setSelectedTransaction({
      ...selectedTransaction,
      ...partialUpdateTransaction,
    });
  };

  const onChangeTab = (tab: "pending" | "inProgress") => {
    setTypeTransactionList(tab);
    setSelectedTransaction(null);
  };

  const createTransactionOfRequest = async (request: RequestType) => {
    const exchanger = await getUserById(session?.user?.id!);
    const newTransaction: TransactionType = {
      id: crypto.randomUUID(),
      status: "waitingSS",
      requestId: request.id,
      clientId: request.clientId,
      request,
      workerId: session?.user?.id!,
      walletAddress: exchanger.walletAddress!,
      timestamps: {
        createdAt: new Date(),
      },
    };
    createTransaction(newTransaction);

    setRequests((prev) => prev.filter((r) => r.id !== request.id));
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const onSelectRequest = async (request: RequestType) => {
    updateRequest({ id: request.id, status: "taken" });
    createTransactionOfRequest(request);
  };

  const onSelectTransaction = (transaction: TransactionType) => {
    setSelectedTransaction(
      transactions.find((t) => t.id === transaction.id) || null
    );
  };

  return (
    <div>
      <div className="grid lg:grid-cols-2 gap-4">
        {noice && <Noice noice={noice} />}
        <div className="space-y-4">
          <div className="max-w-2xl mx-auto p-4">
            <div className="border-b mb-6">
              <div className="flex space-x-8">
                <TabButton
                  isActive={typeTransactionList === "pending"}
                  onClick={() => onChangeTab("pending")}
                  notificationCount={requestNotificationsCount}
                >
                  Solicitudes Pendientes
                </TabButton>
                <TabButton
                  isActive={typeTransactionList === "inProgress"}
                  onClick={() => onChangeTab("inProgress")}
                  notificationCount={transactionNotificationsCount}
                >
                  En Atención
                </TabButton>
              </div>
            </div>

            {typeTransactionList === "pending" ? (
              <RequestList
                requestList={requests
                  .filter((r) => r.status === "pending")
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )}
                onSelect={onSelectRequest}
              />
            ) : (
              <div>
                <div className="p-4">
                  <div className="space-y-2">
                    <Label>Filtrar por estado</Label>
                    <Select
                      onValueChange={(value) => {
                        if (value === "all") {
                          setSelectedTransactionFilters([]);
                          return;
                        }
                        // Toggle the selected value
                        setSelectedTransactionFilters((prev) => {
                          if (prev.includes(value)) {
                            return prev.filter((v) => v !== value);
                          }
                          return [...prev, value];
                        });
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar estados" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="all">Todos</SelectItem>
                          {!selectedTransactionFilters.some(
                            (f) => f === "waitingSS"
                          ) && (
                            <SelectItem value="waitingSS">
                              Esperando SS
                            </SelectItem>
                          )}
                          {!selectedTransactionFilters.some(
                            (f) => f === "checkingSS"
                          ) && (
                            <SelectItem value="checkingSS">
                              Revisando SS
                            </SelectItem>
                          )}
                          {!selectedTransactionFilters.some(
                            (f) => f === "aproved"
                          ) && (
                            <SelectItem value="aproved">Aprobado</SelectItem>
                          )}
                          {!selectedTransactionFilters.some(
                            (f) => f === "qrRejected"
                          ) && (
                            <SelectItem value="qrRejected">
                              QR Rechazado
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    {/* Display selected filters */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTransactionFilters.map((filter) => (
                        <div
                          key={filter}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                        >
                          {filter === "waitingSS" && "Esperando SS"}
                          {filter === "checkingSS" && "Revisando SS"}
                          {filter === "aproved" && "Aprobado"}
                          {filter === "qrRejected" && "QR Rechazado"}
                          <button
                            onClick={() =>
                              setSelectedTransactionFilters((prev) =>
                                prev.filter((f) => f !== filter)
                              )
                            }
                            className="hover:text-destructive"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <TransactionsList
                  transactionList={transactions
                    .filter(
                      (t) => t.status !== "finished" && t.status !== "rejected"
                    )
                    .filter((t) => {
                      if (selectedTransactionFilters.length === 0) {
                        return true;
                      }
                      return selectedTransactionFilters.includes(t.status);
                    })
                    .sort((a, b) => {
                      // Ordenar primero por el estado
                      const statusComparison =
                        statusOrder[a.status] - statusOrder[b.status];
                      if (statusComparison !== 0) {
                        return statusComparison;
                      }

                      // Ordenar por el timestamp correspondiente a cada estado
                      const getTimestamp = (transaction: TransactionType) => {
                        switch (transaction.status) {
                          case "checkingSS":
                            return new Date(
                              transaction.timestamps.ssSendAt!
                            ).getTime();
                          case "qrRejected":
                            return new Date(
                              transaction.timestamps.qrRejectedAt!
                            ).getTime();
                          case "aproved":
                            return new Date(
                              transaction.timestamps.ssResultAt!
                            ).getTime();
                          case "waitingSS":
                            return new Date(
                              transaction.timestamps.createdAt
                            ).getTime();
                          default:
                            return 0;
                        }
                      };

                      return getTimestamp(a) - getTimestamp(b);
                    })}
                  selected={selectedTransaction?.id}
                  onSelect={onSelectTransaction}
                />
              </div>
            )}
          </div>
        </div>

        {typeTransactionList === "inProgress" && selectedTransaction ? (
          <div className="bg-card p-6 rounded-lg shadow-lg w-full">
            <div className="space-y-6 w-full">
              <h2 className="text-2xl font-bold">Solicitud en Revisión</h2>

              {selectedTransaction.status === "waitingSS" && (
                <div className="text-center p-8 w-full">
                  <p className="text-lg">
                    Esperando captura de pantalla del cliente...
                  </p>
                  <WaitSSIcon />
                </div>
              )}

              {selectedTransaction.status === "checkingSS" && (
                <div className="space-y-4">
                  <CheckSS
                    selectedTransaction={selectedTransaction}
                    handleVerification={handleVerification}
                  />
                </div>
              )}

              {selectedTransaction.status === "aproved" && qrCode && (
                <div className="space-y-4 w-full">
                  <Payment
                    qrCode={qrCode}
                    handlePayment={handlePayment}
                    applyCommission={applyCommission}
                    handleQRRejected={handleQRRejected}
                  />
                </div>
              )}

              {selectedTransaction.status === "qrRejected" && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>Esperando a que el cliente actualice su QR.</p>
                </div>
              )}

              {selectedTransaction.status === "finished" && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>La transacción ha sido completada!</p>
                </div>
              )}

              {selectedTransaction.status === "rejected" && (
                <div className="text-center p-8 text-muted-foreground">
                  <p>La transacción ha sido rechazada!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            <p>Puedes elegir alguna solicitud!</p>
            <UnselectTransactionIcon />
          </div>
        )}
      </div>
    </div>
  );
}
