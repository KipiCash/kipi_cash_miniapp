import { TransactionStatus } from "@/app/types/transactionStatus";
import { RequestType } from "./request";
import { TimestampsType } from "./timestamp";
import { RejectReason } from "@/db/types";
export interface TransactionType {
  id: string;
  workerId: string;
  requestId: string;
  clientId: string;
  request: RequestType;
  status: TransactionStatus;
  walletAddress: string;
  timestamps: TimestampsType;
  clientSSImgUrl?: string;
  rejectReason?: RejectReason;
  changeAmount?: number;
  finalAmount?: number;
  responseSSImgUrl?: string;
}
