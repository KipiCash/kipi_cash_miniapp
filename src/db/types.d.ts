export type UserRole = "client" | "exchanger" | "admin";
interface User {
  userId: string;
  email: string;
  image: string;
  name: string;
  role: UserRole;
  banUntil: Date | null;
  qrImgUrl?: string;
  walletAddress?: string;
}

export interface Client {
  username: string;
  wallet: string;
}

type PartialUser = Partial<User> & Required<Pick<User, "userId" | "role">>;

export type RequestStatus = "pending" | "taken";

export interface Request {
  id: string;
  status: RequestStatus;
  createdAt: Date;
  clientId: string;
}

type PartialRequest = Partial<Request> & Required<Pick<Request, "id">>;

type TransactionStatus =
  | "waitingSS"
  | "checkingSS"
  | "aproved"
  | "rejected"
  | "qrRejected"
  | "finished";

type RejectReason = "falsified" | "already_charged" | "ss_error";

export interface Transaction {
  id: string;
  status: TransactionStatus;
  requestId: string;
  clientId: string;
  workerId: string;
  walletAddress: string;
  timestamps: TransactionTimestamps;
  clientSSImgUrl?: string;
  rejectReason?: RejectReason;
  changeAmount?: number;
  finalAmount?: number;
  responseSSImgUrl?: string;
}

export interface TransactionTimestamps {
  createdAt: Date;
  ssSendAt?: Date;
  ssResultAt?: Date;
  finishedAt?: Date;
  qrRejectedAt?: Date;
}

export type PartialTransaction = Partial<Transaction> &
  Required<Pick<Transaction, "id">>;

export interface BanInput {
  userId: string;
  banUntil: Date;
}

export interface Commission {
  commissionAmount: number;
  commissionType: "percentage" | "fixed";
}
export interface ConfigType {
  commission: Commission;
  tutorialUrl: string;
}
