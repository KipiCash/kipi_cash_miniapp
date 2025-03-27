export interface Client {
  username: string;
  wallet: string;
}

export interface BuyItem {
  itemId: string;
  amount: number;
  redemed: number;
  price: number;
}

export interface BuyEntry {
  storeId: string;
  items: BuyItem[];
}

export interface Buy {
  id?: string;
  clientId: string;
  paymentId: string;
  buys: BuyEntry[];
}

export interface Payment {
  clientId: string;
  paidAt: string;
  amount: number;
  commissionAmount: number;
}

export type CategoryType = "product" | "service";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

export interface Direction {
  direction: string;
}

export interface Local {
  direction: Direction;
  reference: string;
  referenceImgLink: string;
}

export interface Contact {
  number: string;
  altNumbers: string[];
  email: string;
  socialMedia: Map<string, string>;
}

export interface Store {
  id?;
  name: string;
  local?: Local;
  categoryIds: string[];
  logoImgLink?: string;
  contact: Contact;
  storeManagerId: string;
}

export interface Specification {
  name: string;
  value: string;
}

export interface Instruction {
  instructions: string;
  contactNumber?: string;
  direction?: string;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  specifications?: Specification[];
  externalId?: string;
  imageImgLink?: string;
  altImgLinks?: string[];
  price: number;
  stock: number;
  instruction: Instruction;
  status: string;
  storeId: string;
}

export type CommissionType = "percentage" | "fixed";

export interface CommissionsClient {
  id: string;
  minThreshold: number | null;
  maxThreshold: number | null;
  amount: number;
  type: CommissionType;
}

export interface Offer {
  storeId: string;
  itemId: string;
  offerPrice: number;
}
