import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CommissionsClient } from "./types";
import COLLECTIONS from "./collections";

const dataToCommissionDB = (data: any, id: string): CommissionsClient => {
  return {
    ...data,
    id,
  };
};

const getCommissionById = async (id: string): Promise<CommissionsClient> => {
  const commissionRef = doc(db, COLLECTIONS.COMMISSIONSCLIENT, id);
  const snapshot = await getDoc(commissionRef);

  if (!snapshot.exists()) {
    throw new Error(`Commission with ID ${id} not found`);
  }

  return dataToCommissionDB(snapshot.data(), snapshot.id);
};

const getCommissionByAmount = async (
  amount: number
): Promise<CommissionsClient | null> => {
  const commissionsCollection = collection(db, COLLECTIONS.COMMISSIONSCLIENT);
  const snapshot = await getDocs(commissionsCollection);

  const applicableCommissions = snapshot.docs
    .map((doc) => dataToCommissionDB(doc.data(), doc.id))
    .filter(
      (commission) =>
        (commission.minThreshold === null ||
          amount >= commission.minThreshold) &&
        (commission.maxThreshold === null || amount <= commission.maxThreshold)
    );

  if (applicableCommissions.length > 0) {
    return applicableCommissions.reduce((prev, current) => {
      const prevRange =
        (prev.maxThreshold || Infinity) - (prev.minThreshold || 0);
      const currentRange =
        (current.maxThreshold || Infinity) - (current.minThreshold || 0);

      return currentRange < prevRange ? current : prev;
    });
  }

  return null;
};

const getAllCommissionsByAmount = async (
  amount: number
): Promise<CommissionsClient[]> => {
  try {
    console.log(`Buscando comisiones para monto: ${amount}`);

    const commissionsCollection = collection(db, COLLECTIONS.COMMISSIONSCLIENT);

    const q = query(
      commissionsCollection,
      where("minThreshold", "<=", amount),
      where("maxThreshold", ">=", amount)
    );

    const snapshot = await getDocs(q);

    console.log(
      `Total de comisiones aplicables en la base de datos: ${snapshot.docs.length}`
    );

    if (snapshot.docs.length === 0) {
      console.warn("No hay comisiones aplicables en la base de datos");
      return [];
    }

    const applicableCommissions = snapshot.docs.map((doc) => {
      const data = doc.data();
      return dataToCommissionDB(data, doc.id);
    });

    console.log("Comisiones aplicables:", applicableCommissions);

    return applicableCommissions;
  } catch (error) {
    console.error("Error al obtener comisiones por monto:", error);
    throw error;
  }
};

const getCommissions = async (): Promise<CommissionsClient[]> => {
  const commissionsCollection = collection(db, COLLECTIONS.COMMISSIONSCLIENT);
  const snapshot = await getDocs(commissionsCollection);

  const commissions: CommissionsClient[] = [];
  snapshot.forEach((doc) => {
    commissions.push(dataToCommissionDB(doc.data(), doc.id));
  });

  return commissions;
};

const calculateCommissionAmount = (
  price: number,
  commission: CommissionsClient
): number => {
  if (commission.type === "percentage") {
    return price * (commission.amount / 100);
  } else {
    return commission.amount;
  }
};

export {
  getCommissionById,
  getCommissionByAmount,
  getCommissions,
  getAllCommissionsByAmount,
  calculateCommissionAmount,
};
