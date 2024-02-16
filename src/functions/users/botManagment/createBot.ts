import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { connectToUserDatabase } from "../../../../utils/database";

const moment = require("moment");

export async function createBots(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const userDb = await connectToUserDatabase();
  const collection = userDb.collection("Bots");

  return { body: `Hello, mightymide bot created!` };
}

app.http("createBots", {
  route: "user/createBot",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: createBots,
});
