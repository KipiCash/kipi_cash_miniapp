import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { ConfigType } from "@/db/types";
import COLLECTION from "./collections";

const getConfig = async (): Promise<ConfigType> => {
  const docRef = doc(db, COLLECTION.CONFIGS, "config");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Config not found");
  }
  return docSnap.data() as ConfigType;
};

const updateConfig = async (config: ConfigType): Promise<void> => {
  const docRef = doc(db, COLLECTION.CONFIGS, "config");
  await updateDoc(docRef, {
    id: "config",
    ...config
  });
}

const getExample = async (example_name: string): Promise<string> => {
  const docRef = doc(db, COLLECTION.CONFIGS, "examples");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Config not found");
  }
  return docSnap.data()[example_name];
}

export { getConfig, updateConfig, getExample };