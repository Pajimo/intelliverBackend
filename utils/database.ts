import { Db, MongoClient } from "mongodb";

const url = process.env.COSMOS_DB_CONNECTION_STRING;
const userDBNAME = process.env.COSMOS_DB_USER_DBNAME;
const adminDBNAME = process.env.COSMOS_DB_ADMIN_DBNAME;

let cachedUserDb: Db | null = null;
let cachedAdminDb: Db | null = null;

export const connectToUserDatabase = async () => {
  const client = new MongoClient(url);
  if (cachedUserDb) {
    return cachedUserDb;
  }

  await client.connect();
  const database = client.db(userDBNAME);
  cachedUserDb = database;

  return database;
};

export const connectToAdminDatabase = async () => {
  const client = new MongoClient(url);
  if (cachedAdminDb) {
    return cachedAdminDb;
  }

  await client.connect();
  const database = client.db(adminDBNAME);
  cachedAdminDb = database;

  return database;
};
