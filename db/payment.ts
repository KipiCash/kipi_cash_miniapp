import { db } from "@/lib/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Payment } from "./types";
import COLLECTIONS from "./collections";

export type PartialPayment = Partial<Payment> & { id: string };

const dataToPaymentDB = (data: any, id: string): Payment => {
  return {
    ...data,
    id,
    paidAt: data.paidAt,
  };
};

const setPayment = async (payment: Payment, id?: string) => {
  const paymentRef = id
    ? doc(db, COLLECTIONS.PAYMENT, id)
    : doc(collection(db, COLLECTIONS.PAYMENT));
  await setDoc(paymentRef, payment);
  return paymentRef.id;
};

const getPaymentById = async (id: string): Promise<Payment> => {
  const paymentRef = doc(db, COLLECTIONS.PAYMENT, id);
  const snapshot = await getDoc(paymentRef);

  if (!snapshot.exists()) {
    throw new Error(`Payment with ID ${id} not found`);
  }

  return dataToPaymentDB(snapshot.data(), snapshot.id);
};

const getPaymentsByClient = async (clientId: string): Promise<Payment[]> => {
  const paymentsCollection = collection(db, COLLECTIONS.PAYMENT);
  const clientQuery = query(
    paymentsCollection,
    where("clientId", "==", clientId)
  );

  const snapshot = await getDocs(clientQuery);

  const payments: Payment[] = [];
  snapshot.forEach((doc) => {
    payments.push(dataToPaymentDB(doc.data(), doc.id));
  });

  return payments;
};

const getPayments = async (): Promise<Payment[]> => {
  const paymentsCollection = collection(db, COLLECTIONS.PAYMENT);
  const snapshot = await getDocs(paymentsCollection);

  const payments: Payment[] = [];
  snapshot.forEach((doc) => {
    payments.push(dataToPaymentDB(doc.data(), doc.id));
  });

  return payments;
};

const updatePayment = async (payment: PartialPayment): Promise<void> => {
  const paymentRef = doc(db, COLLECTIONS.PAYMENT, payment.id);
  const { id, ...data } = payment;
  await updateDoc(paymentRef, data);
};

const deletePayment = async (id: string): Promise<void> => {
  const paymentRef = doc(db, COLLECTIONS.PAYMENT, id);
  await deleteDoc(paymentRef);
};

export {
  setPayment,
  getPaymentById,
  getPaymentsByClient,
  getPayments,
  updatePayment,
  deletePayment,
};
