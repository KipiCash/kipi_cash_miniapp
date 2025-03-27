import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Category, CategoryType } from "./types";
import COLLECTIONS from "./collections";

const dataToCategoryDB = (data: any, id: string): Category => {
  return {
    ...data,
    id,
  };
};

const getCategoryById = async (id: string): Promise<Category> => {
  const categoryRef = doc(db, COLLECTIONS.CATEGORY, id);
  const snapshot = await getDoc(categoryRef);

  if (!snapshot.exists()) {
    throw new Error(`Category with ID ${id} not found`);
  }

  return dataToCategoryDB(snapshot.data(), snapshot.id);
};

const getCategoriesByType = async (type: CategoryType): Promise<Category[]> => {
  const categoriesCollection = collection(db, COLLECTIONS.CATEGORY);
  const typeQuery = query(categoriesCollection, where("type", "==", type));

  const snapshot = await getDocs(typeQuery);

  const categories: Category[] = [];
  snapshot.forEach((doc) => {
    categories.push(dataToCategoryDB(doc.data(), doc.id));
  });

  return categories;
};

const getCategories = async (): Promise<Category[]> => {
  const categoriesCollection = collection(db, COLLECTIONS.CATEGORY);
  const snapshot = await getDocs(categoriesCollection);

  const categories: Category[] = [];
  snapshot.forEach((doc) => {
    categories.push(dataToCategoryDB(doc.data(), doc.id));
  });

  return categories;
};

export { getCategoryById, getCategoriesByType, getCategories };
