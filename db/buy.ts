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
import { Buy, BuyEntry, BuyItem } from "./types";
import COLLECTIONS from "./collections";

export type PartialBuy = Partial<Buy> & { id: string };

const dataToBuyDB = (data: any, id: string): Buy => {
  return {
    ...data,
    id,
  };
};

const setBuy = async (buy: Buy, id?: string) => {
  const buyRef = id
    ? doc(db, COLLECTIONS.BUY, id)
    : doc(collection(db, COLLECTIONS.BUY));
  await setDoc(buyRef, buy);
  return buyRef.id;
};

const getBuyById = async (id: string): Promise<Buy> => {
  const buyRef = doc(db, COLLECTIONS.BUY, id);
  const snapshot = await getDoc(buyRef);

  if (!snapshot.exists()) {
    throw new Error(`Buy with ID ${id} not found`);
  }

  return dataToBuyDB(snapshot.data(), snapshot.id);
};

const getBuysByClient = async (clientId: string): Promise<Buy[]> => {
  const buysCollection = collection(db, COLLECTIONS.BUY);
  const clientQuery = query(buysCollection, where("clientId", "==", clientId));

  const snapshot = await getDocs(clientQuery);

  const buys: Buy[] = [];
  snapshot.forEach((doc) => {
    buys.push(dataToBuyDB(doc.data(), doc.id));
  });

  return buys;
};

const getBuysByPayment = async (paymentId: string): Promise<Buy[]> => {
  const buysCollection = collection(db, COLLECTIONS.BUY);
  const paymentQuery = query(
    buysCollection,
    where("paymentId", "==", paymentId)
  );

  const snapshot = await getDocs(paymentQuery);

  const buys: Buy[] = [];
  snapshot.forEach((doc) => {
    buys.push(dataToBuyDB(doc.data(), doc.id));
  });

  return buys;
};

const getBuysByStore = async (storeId: string): Promise<Buy[]> => {
  const buysCollection = collection(db, COLLECTIONS.BUY);
  const snapshot = await getDocs(buysCollection);

  const buys: Buy[] = [];
  snapshot.forEach((doc) => {
    const buyData = doc.data();
    const hasStore = buyData.buys.some(
      (entry: BuyEntry) => entry.storeId === storeId
    );

    if (hasStore) {
      buys.push(dataToBuyDB(buyData, doc.id));
    }
  });

  return buys;
};

const getBuysByItem = async (itemId: string): Promise<Buy[]> => {
  const buysCollection = collection(db, COLLECTIONS.BUY);
  const snapshot = await getDocs(buysCollection);

  const buys: Buy[] = [];
  snapshot.forEach((doc) => {
    const buyData = doc.data();
    const hasItem = buyData.buys.some((entry: BuyEntry) =>
      entry.items.some((item: BuyItem) => item.itemId === itemId)
    );

    if (hasItem) {
      buys.push(dataToBuyDB(buyData, doc.id));
    }
  });

  return buys;
};

const getBuys = async (): Promise<Buy[]> => {
  const buysCollection = collection(db, COLLECTIONS.BUY);
  const snapshot = await getDocs(buysCollection);

  const buys: Buy[] = [];
  snapshot.forEach((doc) => {
    buys.push(dataToBuyDB(doc.data(), doc.id));
  });

  return buys;
};

const updateBuy = async (buy: PartialBuy): Promise<void> => {
  const buyRef = doc(db, COLLECTIONS.BUY, buy.id);
  const { id, ...data } = buy;
  await updateDoc(buyRef, data);
};

const deleteBuy = async (id: string): Promise<void> => {
  const buyRef = doc(db, COLLECTIONS.BUY, id);
  await deleteDoc(buyRef);
};

export {
  setBuy,
  getBuyById,
  getBuysByClient,
  getBuysByPayment,
  getBuysByStore,
  getBuysByItem,
  getBuys,
  updateBuy,
  deleteBuy,
};
