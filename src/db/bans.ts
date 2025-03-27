import { db } from "@/lib/firebase";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { BanInput } from "./types";
import COLLECTION from "./collections";

const banUser = (data: BanInput): void => {
  const userRef = doc(db, COLLECTION.USERS, data.userId);
  updateDoc(userRef, {
    banUntil: data.banUntil,
  });

  const banRef = collection(db, COLLECTION.BANS);
  addDoc(banRef, {
    userId: data.userId,
    banDate: new Date(),
    banUntil: data.banUntil,
  });
};

const unbanUser = (id: string): void => {
  const userRef = doc(db, COLLECTION.USERS, id);
  updateDoc(userRef, {
    bannerUntil: null,
  });
};

export { banUser, unbanUser };
