import "server-only";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "new_year_prize_draw";

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

export function getClientPromise() {
  if (!globalForMongo.mongoClientPromise) {
    globalForMongo.mongoClientPromise = new MongoClient(uri).connect();
  }

  return globalForMongo.mongoClientPromise;
}

export async function getDb() {
  const client = await getClientPromise();
  return client.db(dbName);
}
