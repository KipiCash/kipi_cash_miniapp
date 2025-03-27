import { RequestStatus } from "@/db/types";

export interface RequestType {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientImage: string;
  createdAt: Date;
  status: RequestStatus;
}
