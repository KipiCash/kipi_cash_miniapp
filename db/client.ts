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
import { Client } from "./types";
import COLLECTIONS from "./collections";

export type PartialClient = Partial<Client> & { id: string };

const dataToClientDB = (data: any, id: string): Client => {
  return {
    ...data,
    id,
  };
};

const setClient = async (client: Client, id: string): Promise<void> => {
  const clientRef = doc(collection(db, COLLECTIONS.CLIENT), id);
  await setDoc(clientRef, client);
};

const getClientById = async (id: string): Promise<Client> => {
  const clientRef = doc(db, COLLECTIONS.CLIENT, id);
  const snapshot = await getDoc(clientRef);

  if (!snapshot.exists()) {
    throw new Error(`Client with ID ${id} not found`);
  }

  return dataToClientDB(snapshot.data(), snapshot.id);
};

const getClientByWallet = async (wallet: string): Promise<Client | null> => {
  const clientsCollection = collection(db, COLLECTIONS.CLIENT);
  const walletQuery = query(clientsCollection, where("wallet", "==", wallet));

  const snapshot = await getDocs(walletQuery);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return dataToClientDB(doc.data(), doc.id);
};

const getClients = async (): Promise<Client[]> => {
  const clientsCollection = collection(db, COLLECTIONS.CLIENT);
  const snapshot = await getDocs(clientsCollection);

  const clients: Client[] = [];
  snapshot.forEach((doc) => {
    clients.push(dataToClientDB(doc.data(), doc.id));
  });

  return clients;
};

const updateClient = async (client: PartialClient): Promise<void> => {
  const clientRef = doc(db, COLLECTIONS.CLIENT, client.id);
  const { id, ...data } = client;
  await updateDoc(clientRef, data);
};

const deleteClient = async (id: string): Promise<void> => {
  const clientRef = doc(db, COLLECTIONS.CLIENT, id);
  await deleteDoc(clientRef);
};

export {
  setClient,
  getClientById,
  getClientByWallet,
  getClients,
  updateClient,
  deleteClient,
};
