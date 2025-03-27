import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Store } from "./types";
import COLLECTIONS from "./collections";

const dataToStoreDB = (data: any, id: string): Store => {
  const socialMedia = new Map(Object.entries(data.contact.socialMedia || {}));

  return {
    ...data,
    id,
    contact: {
      ...data.contact,
      socialMedia,
    },
  };
};

const getStoreById = async (id: string): Promise<Store> => {
  const storeRef = doc(db, COLLECTIONS.STORE, id);
  const snapshot = await getDoc(storeRef);

  if (!snapshot.exists()) {
    throw new Error(`Store with ID ${id} not found`);
  }

  return dataToStoreDB(snapshot.data(), snapshot.id);
};

const getStoresByCategory = async (categoryId: string): Promise<Store[]> => {
  const storesCollection = collection(db, COLLECTIONS.STORE);
  const snapshot = await getDocs(storesCollection);

  const stores: Store[] = [];
  snapshot.forEach((doc) => {
    const storeData = doc.data();
    if (storeData.categoryIds && storeData.categoryIds.includes(categoryId)) {
      stores.push(dataToStoreDB(storeData, doc.id));
    }
  });

  return stores;
};

const getStoresByManager = async (storeManagerId: string): Promise<Store[]> => {
  const storesCollection = collection(db, COLLECTIONS.STORE);
  const managerQuery = query(
    storesCollection,
    where("storeManagerId", "==", storeManagerId)
  );

  const snapshot = await getDocs(managerQuery);

  const stores: Store[] = [];
  snapshot.forEach((doc) => {
    stores.push(dataToStoreDB(doc.data(), doc.id));
  });

  return stores;
};

const getStores = async (): Promise<Store[]> => {
  const storesCollection = collection(db, COLLECTIONS.STORE);
  const snapshot = await getDocs(storesCollection);

  const stores: Store[] = [];
  snapshot.forEach((doc) => {
    stores.push(dataToStoreDB(doc.data(), doc.id));
  });

  return stores;
};

export { getStoreById, getStoresByCategory, getStoresByManager, getStores };
