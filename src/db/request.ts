import { db } from "@/lib/firebase";
import { PartialRequest, Request, RequestStatus } from "./types";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { RequestType } from "@/app/types/request";
import { getUserById } from "./users";
import COLLECTIONS from "./collections";

// Conviernte una solicitud de DB a front
const RequestDBtoFront = async (data: Request): Promise<RequestType> => {
  const client = await getUserById(data.clientId);
  return {
    id: data.id,
    clientId: data.clientId,
    createdAt: data.createdAt,
    status: data.status,
    clientEmail: client.email,
    clientImage: client.image,
    clientName: client.name,
  };
};

// Convierte una solicitud de front a DB
const RequestFronttoDB = (data: RequestType): Request => {
  return {
    id: data.id,
    clientId: data.clientId,
    createdAt: data.createdAt,
    status: data.status,
  };
};

const dataToRequestDB = (data: DocumentData, id: string): Request => {
  return {
    id: id,
    clientId: data.clientId,
    createdAt: data.createdAt.toDate(),
    status: data.status,
  };
};

// Convierte un snapshot a un array de solicitudes
const snapToArray: (snap: QuerySnapshot) => RequestType[] = (snap) => {
  const requests: RequestType[] = [];
  snap.docs.forEach(async (doc) => {
    const data: Request = dataToRequestDB(doc.data(), doc.id);
    requests.push(await RequestDBtoFront(data));
  });
  return requests;
};

// Crea o sobreescribe una solicitud
const setRequest = async (request: RequestType): Promise<void> => {
  const currReq = await getCurrentRequest(request.clientId);
  if (currReq) {
    return
  }
  const requestRef = doc(collection(db, COLLECTIONS.REQUESTS), request.id);
  const requestDB = RequestFronttoDB(request);
  await setDoc(requestRef, requestDB);
};

// Obtiene una solicitud por su ID
const getRequestById = async (id: string): Promise<RequestType> => {
  const requestRef = doc(db, COLLECTIONS.REQUESTS, id);
  const snapshot = await getDoc(requestRef);
  if (!snapshot.exists()) {
    throw new Error(`Request with ID ${id} not found`);
  }
  const data: Request = dataToRequestDB(snapshot.data(), snapshot.id);
  return RequestDBtoFront(data);
};

// Obtiene todas las solicitudes
const getRequests = async (): Promise<RequestType[]> => {
  const requestsCollection = collection(db, COLLECTIONS.REQUESTS);
  const snapshot = await getDocs(requestsCollection);
  return snapToArray(snapshot);
};

// Obtener solicitudes por estado
const getRequestsByStatus = async (
  status: RequestStatus
): Promise<RequestType[]> => {
  const requestsCollection = collection(db, COLLECTIONS.REQUESTS);
  const statusQuery = query(requestsCollection, where("status", "==", status));
  const snapshot = await getDocs(statusQuery);
  return snapToArray(snapshot);
};

// Obtiene solicitudes por cliente
const getRequestsByClient = async (
  clientId: string
): Promise<RequestType[]> => {
  const requestsCollection = collection(db, COLLECTIONS.REQUESTS);
  const clientQuery = query(
    requestsCollection,
    where("clientId", "==", clientId)
  );
  const snapshot = await getDocs(clientQuery);
  return snapToArray(snapshot);
};

const getCurrentRequest = async (
  clientId: string
): Promise<RequestType | null> => {
  const requestsCollection = collection(db, COLLECTIONS.REQUESTS);
  const clientQuery = query(
    requestsCollection,
    where("clientId", "==", clientId),
    where("status", "==", "pending")
  );
  const snapshot = await getDocs(clientQuery);
  if (snapshot.empty) {
    return null;
  }
  const data = {
    ...(snapshot.docs[0].data() as Request),
    createdAt: snapshot.docs[0].data().createdAt.toDate(),
  };
  const currentRequest = await RequestDBtoFront(data);
  return currentRequest;
};

// Actualiza una solicitud
const updateRequest = async (request: PartialRequest): Promise<void> => {
  const requestRef = doc(db, COLLECTIONS.REQUESTS, request.id);
  await updateDoc(requestRef, request);
};

// Elimina una solicitud
const deleteRequest = async (id: string): Promise<void> => {
  // Medidas en caso tenga una trasacción asociada
  const transactionsQuery = query(
    collection(db, COLLECTIONS.TRANSACTIONS),
    where("requestId", "==", id)
  );
  const transactionsSnapshot = await getDocs(transactionsQuery);
  if (!transactionsSnapshot.empty) {
    return;
  }
  const requestRef = doc(db, COLLECTIONS.REQUESTS, id);
  await deleteDoc(requestRef);
};

export {
  setRequest,
  getRequestById,
  getRequests,
  getRequestsByStatus,
  getRequestsByClient,
  getCurrentRequest,
  updateRequest,
  deleteRequest,
  RequestDBtoFront,
  RequestFronttoDB,
  dataToRequestDB,
};
