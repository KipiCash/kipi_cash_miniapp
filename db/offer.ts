import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Offer } from "./types";
import COLLECTIONS from "./collections";

const dataToOfferDB = (data: any, id: string): Offer => {
  return {
    ...data,
    id,
  };
};

const getOfferById = async (id: string): Promise<Offer> => {
  const offerRef = doc(db, COLLECTIONS.OFFER, id);
  const snapshot = await getDoc(offerRef);

  if (!snapshot.exists()) {
    throw new Error(`Offer with ID ${id} not found`);
  }

  return dataToOfferDB(snapshot.data(), snapshot.id);
};

const getOffersByStore = async (storeId: string): Promise<Offer[]> => {
  const offersCollection = collection(db, COLLECTIONS.OFFER);
  const storeQuery = query(offersCollection, where("storeId", "==", storeId));

  const snapshot = await getDocs(storeQuery);

  const offers: Offer[] = [];
  snapshot.forEach((doc) => {
    offers.push(dataToOfferDB(doc.data(), doc.id));
  });

  return offers;
};

const getOffersByItem = async (itemId: string): Promise<Offer[]> => {
  const offersCollection = collection(db, COLLECTIONS.OFFER);
  const itemQuery = query(offersCollection, where("itemId", "==", itemId));

  const snapshot = await getDocs(itemQuery);

  const offers: Offer[] = [];
  snapshot.forEach((doc) => {
    offers.push(dataToOfferDB(doc.data(), doc.id));
  });

  return offers;
};

const getOffers = async (): Promise<Offer[]> => {
  const offersCollection = collection(db, COLLECTIONS.OFFER);
  const snapshot = await getDocs(offersCollection);

  const offers: Offer[] = [];
  snapshot.forEach((doc) => {
    offers.push(dataToOfferDB(doc.data(), doc.id));
  });

  return offers;
};

export { getOfferById, getOffersByStore, getOffersByItem, getOffers };
