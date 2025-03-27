import { db } from "@/lib/firebase";
import { PartialTransaction, Transaction } from "./types";
import {
  and,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { TransactionType } from "@/app/types/transaction";
import { getRequestById, RequestDBtoFront } from "./request";
import COLLECTIONS from "./collections";
import { TransactionInfo } from "@/components/DashboardAdminTable";
import { getUserById } from "./users";

const trasactionDBToAdminInfo = async (
  transactionDB: Transaction
): Promise<TransactionInfo | null> => {
  try {
    const request = await getRequestById(transactionDB.requestId);
    const exchanger = await getUserById(transactionDB.workerId);
    return {
      id: transactionDB.id,
      date: transactionDB.timestamps.finishedAt!,
      clientName: request.clientName,
      exchangerName: exchanger.name,
      finalAmount: transactionDB.finalAmount!,
      clientSSUrl: transactionDB.clientSSImgUrl!,
      exchangerSSUrl: transactionDB.responseSSImgUrl!,
      changeAmount: transactionDB.changeAmount!,
      revenue: transactionDB.changeAmount! - transactionDB.finalAmount!,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getTransactionsAdmin = async (): Promise<TransactionInfo[]> => {
  const queryTransaction = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    where("status", "==", "finished")
  );
  const snapshot = await getDocs(queryTransaction);
  const transactionsDB: Transaction[] = [];
  snapshot.forEach(async (doc: DocumentData) => {
    const data = doc.data();
    transactionsDB.push(dataToTransactionDB(data, doc.id));
  });
  const transactions = await Promise.all(
    transactionsDB.map((transaction) => trasactionDBToAdminInfo(transaction))
  );
  const transactionsFiltered = transactions.filter(
    (transaction) => transaction !== null
  );
  return transactionsFiltered as TransactionInfo[];
};

const transactionDBtoFront = async (
  transaction: Transaction
): Promise<TransactionType> => {
  try {
    await getRequestById(transaction.requestId);
  } catch (error) {
    console.log("Error getting request by id", error);
  }

  const request = await getRequestById(transaction.requestId);
  const requestFront = await RequestDBtoFront(request);

  return {
    id: transaction.id,
    workerId: transaction.workerId,
    clientId: transaction.clientId,
    requestId: transaction.requestId,
    request: requestFront,
    status: transaction.status,
    walletAddress: transaction.walletAddress,
    timestamps: {
      ...transaction.timestamps,
    },
    ...(transaction.clientSSImgUrl && {
      clientSSImgUrl: transaction.clientSSImgUrl,
    }),
    ...(transaction.rejectReason && { rejectReason: transaction.rejectReason }),
    ...(transaction.changeAmount && { changeAmount: transaction.changeAmount }),
    ...(transaction.finalAmount && { finalAmount: transaction.finalAmount }),
    ...(transaction.responseSSImgUrl && {
      responseSSImgUrl: transaction.responseSSImgUrl,
    }),
  };
};

const transactionfrontToDB = (transaction: TransactionType): Transaction => {
  return {
    id: transaction.id,
    status: transaction.status,
    requestId: transaction.requestId,
    clientId: transaction.clientId,
    workerId: transaction.workerId,
    walletAddress: transaction.walletAddress,
    timestamps: transaction.timestamps,
    ...(transaction.clientSSImgUrl && {
      clientSSImgUrl: transaction.clientSSImgUrl,
    }),
    ...(transaction.rejectReason && { rejectReason: transaction.rejectReason }),
    ...(transaction.changeAmount && { changeAmount: transaction.changeAmount }),
    ...(transaction.finalAmount && { finalAmount: transaction.finalAmount }),
    ...(transaction.responseSSImgUrl && {
      responseSSImgUrl: transaction.responseSSImgUrl,
    }),
  };
};

const dataToTransactionDB = (data: DocumentData, id: string): Transaction => {
  return {
    ...(data as Transaction),
    id: id,
    timestamps: {
      ...data.timestamps,
      createdAt: data.timestamps.createdAt.toDate(),
      ...(data.timestamps.ssSendAt && {
        ssSendAt: data.timestamps.ssSendAt.toDate(),
      }),
      ...(data.timestamps.ssResultAt && {
        ssResultAt: data.timestamps.ssResultAt.toDate(),
      }),
      ...(data.timestamps.finishedAt && {
        finishedAt: data.timestamps.finishedAt.toDate(),
      }),
      ...(data.timestamps.qrRejectedAt && {
        qrRejectedAt: data.timestamps.qrRejectedAt.toDate(),
      }),
    },
  };
};

const snapToArray = async (
  snapshot: QuerySnapshot
): Promise<TransactionType[]> => {
  const transactionsDB: Transaction[] = [];
  snapshot.forEach(async (doc: DocumentData) => {
    const data = doc.data();
    transactionsDB.push(dataToTransactionDB(data, doc.id));
  });
  return Promise.all(
    transactionsDB.map((transaction) => {
      return transactionDBtoFront(transaction);
    })
  );
};

const createTransaction = async (
  transaction: TransactionType
): Promise<void> => {
  transaction.timestamps.createdAt = new Date();
  transaction.status = "waitingSS";
  const transactionRef = doc(
    collection(db, COLLECTIONS.TRANSACTIONS),
    transaction.id
  );
  const transactionDB = transactionfrontToDB(transaction);
  await setDoc(transactionRef, transactionDB);
};

const getTransactionById = async (id: string): Promise<TransactionType> => {
  const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  const snapshot = await getDoc(transactionRef);
  if (!snapshot.exists()) {
    throw new Error(`Transaction with ID ${id} not found`);
  }
  const data: Transaction = dataToTransactionDB(snapshot.data(), snapshot.id);
  return transactionDBtoFront(data);
};

// ! DEBUG
const getAllTransactionsDebug = async (): Promise<TransactionType[]> => {
  const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
  const snapshot = await getDocs(transactionsCollection);
  return snapToArray(snapshot);
};

const getTransactionsByRequest = async (
  requestId: string
): Promise<TransactionType[]> => {
  const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
  const requestQuery = query(
    transactionsCollection,
    where("requestId", "==", requestId)
  );
  const snapshot = await getDocs(requestQuery);
  return snapToArray(snapshot);
};

const getTransactionsByExchanger = async (
  workerId: string
): Promise<TransactionType[]> => {
  const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
  const workerQuery = query(
    transactionsCollection,
    where("workerId", "==", workerId)
  );
  const snapshot = await getDocs(workerQuery);
  return snapToArray(snapshot);
};

const getTransactions = async (): Promise<TransactionType[]> => {
  const transactionsCollection = collection(db, COLLECTIONS.TRANSACTIONS);
  const snapshot = await getDocs(transactionsCollection);
  return snapToArray(snapshot);
};

const getCurrentTransactionByClient = async (
  clientId: string
): Promise<TransactionType | null> => {
  const transactionQuery = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    and(where("clientId", "==", clientId))
  );
  const snapshot = await getDocs(transactionQuery);
  if (snapshot.empty) {
    return null;
  }

  const transactions = await snapToArray(snapshot);
  return transactions.filter(
    (t) => t.status !== "finished" && t.status !== "rejected"
  )[0];
};

const getTransactionsByClient = async (
  clientId: string
): Promise<TransactionType[]> => {
  const transactionsQuery = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    and(
      where("clientId", "==", clientId),
      where("status", "in", ["finished", "rejected"])
    )
  )
  const snapshot = await getDocs(transactionsQuery);
  return snapToArray(snapshot);
};

const updateTransaction = async (
  transaction: PartialTransaction
): Promise<void> => {
  const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, transaction.id);

  await updateDoc(transactionRef, transaction);
};

const deleteTransaction = async (id: string): Promise<void> => {
  const transactionRef = doc(db, COLLECTIONS.TRANSACTIONS, id);
  await deleteDoc(transactionRef);
};

export {
  createTransaction,
  getTransactionById,
  getTransactionsByRequest,
  getTransactionsByExchanger,
  getTransactions,
  getCurrentTransactionByClient,
  getTransactionsByClient,
  updateTransaction,
  deleteTransaction,
  transactionDBtoFront,
  transactionfrontToDB,
  dataToTransactionDB,
  getTransactionsAdmin,
  getAllTransactionsDebug,
};
