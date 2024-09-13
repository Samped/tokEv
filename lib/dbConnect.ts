import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    cachedPromise = MongoClient.connect(MONGODB_URI, {
      // Options are not needed here
    }).then((client) => {
      cachedClient = client;
      return client;
    });
  }

  return cachedPromise;
}

export default connectToDatabase();
