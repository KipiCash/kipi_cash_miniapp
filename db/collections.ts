const env = process.env.NEXT_PUBLIC_ENVIRONMENT ?? "dev";

const COLLECTIONS = {
  CLIENT: "clients",
  BUY: "buys",
  PAYMENT: "payments",
  CATEGORY: "categories",
  STORE: "stores",
  ITEM: "items",
  OFFER: "offers",
  COMMISSIONSCLIENT: "commissions-client",
};

if (env === "dev") {
  Object.assign(COLLECTIONS, {
    CLIENT: "dev/dev/clients",
    BUY: "dev/dev/buys",
    PAYMENT: "dev/dev/payments",
    CATEGORY: "dev/dev/categories",
    STORE: "dev/dev/stores",
    ITEM: "dev/dev/items",
    OFFER: "dev/dev/offers",
    COMMISSIONSCLIENT: "dev/dev/commissions-client",
  });
}

export default COLLECTIONS;
