import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Item, Specification, Instruction } from "./types";
import COLLECTIONS from "./collections";

const dataToItemDB = (data: any, id: string): Item => {
  return {
    ...data,
    id,
  };
};

const getItemById = async (id: string): Promise<Item> => {
  const itemRef = doc(db, COLLECTIONS.ITEM, id);
  const snapshot = await getDoc(itemRef);

  if (!snapshot.exists()) {
    throw new Error(`Item with ID ${id} not found`);
  }

  return dataToItemDB(snapshot.data(), snapshot.id);
};

const getItemsByCategory = async (categoryId: string): Promise<Item[]> => {
  const itemsCollection = collection(db, COLLECTIONS.ITEM);
  const categoryQuery = query(
    itemsCollection,
    where("categoryId", "==", categoryId)
  );

  const snapshot = await getDocs(categoryQuery);

  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push(dataToItemDB(doc.data(), doc.id));
  });

  return items;
};

const getItemsByStatus = async (status: string): Promise<Item[]> => {
  const itemsCollection = collection(db, COLLECTIONS.ITEM);
  const statusQuery = query(itemsCollection, where("status", "==", status));

  const snapshot = await getDocs(statusQuery);

  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push(dataToItemDB(doc.data(), doc.id));
  });

  return items;
};

// ? no recuerdo qué era external ID pero en cualquier caso lo dejo
const getItemByExternalId = async (
  externalId: string
): Promise<Item | null> => {
  const itemsCollection = collection(db, COLLECTIONS.ITEM);
  const externalQuery = query(
    itemsCollection,
    where("externalId", "==", externalId)
  );

  const snapshot = await getDocs(externalQuery);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return dataToItemDB(doc.data(), doc.id);
};

const getItemsByStore = async (storeId: string): Promise<Item[]> => {
  const itemsCollection = collection(db, COLLECTIONS.ITEM);
  const storeQuery = query(itemsCollection, where("storeId", "==", storeId));

  const snapshot = await getDocs(storeQuery);

  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push(dataToItemDB(doc.data(), doc.id));
  });

  return items;
};

const getItems = async (): Promise<Item[]> => {
  const itemsCollection = collection(db, COLLECTIONS.ITEM);
  const snapshot = await getDocs(itemsCollection);

  const items: Item[] = [];
  snapshot.forEach((doc) => {
    items.push(dataToItemDB(doc.data(), doc.id));
  });

  return items;
};

export {
  getItemById,
  getItemsByCategory,
  getItemsByStatus,
  getItemByExternalId,
  getItemsByStore,
  getItems,
};
