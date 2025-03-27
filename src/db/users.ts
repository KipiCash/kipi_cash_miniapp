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
import { PartialUser, User, UserRole } from "./types";
import { User as UserType } from "next-auth";
import COLLECTION from "./collections";

// Si es un cliente, se asegura que no tenga walletAddress
// Si es un exchanger, se asegura que no tenga qrImgUrl
const userBDtoFront = (user: User): UserType => {
  const newUser: UserType = {
    email: user.email,
    image: user.image,
    name: user.name,
    role: user.role,
    id: user.userId,
    banUntil: user.banUntil,
  };
  if (user.role == "client") {
    newUser.qrImgUrl = user.qrImgUrl;
  } else if (user.role == "exchanger") {
    newUser.walletAddress = user.walletAddress;
  } else if (user.role == "admin") {
  } else if (user.role == undefined) {
  } else {
    throw new Error("Invalid role");
  }
  return newUser;
};

// Crea o sobreescribe un usuario
const setUser = async (newUser: User): Promise<void> => {
  const userRef = doc(collection(db, COLLECTION.USERS), newUser.userId);
  const data = userBDtoFront(newUser);
  await setDoc(userRef, data);
};

// Obtiene un usuario por su ID
const getUserById = async (userId: string): Promise<User> => {
  const userRef = doc(db, COLLECTION.USERS, userId);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data() as User;
  return user;
};

// Obtener todos los clientes o exchangers
const getUsersByRole = async (role: UserRole): Promise<Array<UserType>> => {
  const usersCollection = collection(db, COLLECTION.USERS);
  const userQuery = query(usersCollection, where("role", "==", role));
  const snapshot = await getDocs(userQuery);
  if (snapshot.empty) {
    return [];
  }
  const users: Array<UserType> = [];
  snapshot.forEach((doc) => {
    const user = doc.data() as User;
    user.userId = doc.id;
    users.push(userBDtoFront(user));
  });
  return users;
};

const getUsers = async (): Promise<Array<UserType>> => {
  const usersCollection = collection(db, COLLECTION.USERS);
  const snapshot = await getDocs(usersCollection);
  if (snapshot.empty) {
    return [];
  }
  const users: Array<UserType> = [];
  snapshot.forEach((doc) => {
    const user = doc.data() as User;
    user.userId = doc.id;
    users.push(userBDtoFront(user));
  });
  return users;
};

// Actualiza un usuario
const updateUser = async (user: PartialUser): Promise<void> => {
  const userRef = doc(db, COLLECTION.USERS, user.userId);
  if (user.role == "client" && user.walletAddress) {
    user.walletAddress = undefined;
  }
  if (user.role == "exchanger" && user.qrImgUrl) {
    user.qrImgUrl = undefined;
  }
  await updateDoc(userRef, user);
};

// Elimina un usuario
const deleteUser = async (userId: string): Promise<void> => {
  const clientRef = doc(db, COLLECTION.USERS, userId);
  await deleteDoc(clientRef);
};

export {
  setUser,
  getUsers,
  getUserById,
  getUsersByRole,
  updateUser,
  deleteUser,
  userBDtoFront,
};
