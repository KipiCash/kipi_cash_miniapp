export const enableTesting = process.env.NEXT_PUBLIC_ENABLE_TESTING ?? false;

type CollectionsDB = {
  BANS: string
  USERS: string
  CLIENT: string
  TRANSACTIONS: string
  CONFIGS: string
  REQUESTS: string
  LOGS: string
}

const COLLECTIONS: CollectionsDB = {
  BANS: "bans",
  USERS: "users",
  CLIENT: "client",
  TRANSACTIONS: "transactions",
  CONFIGS: "configs",
  REQUESTS: "requests",
  LOGS: "logs",
};

if (enableTesting) {
  Object.assign(COLLECTIONS, {
    TRANSACTIONS: "/testing/__testing/transactions",
    REQUESTS: "/testing/__testing/requests",
    LOGS: "/testing/__testing/logs",
  });
}

export default COLLECTIONS;
