import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToUserDatabase } from "../../../../utils/database";
import { firstMightyUser } from "../../../../utils/userStructure";

const bcrypt = require("bcrypt");

export async function loginUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  //   const name = request.query.get("name") || (await request.text()) || "world";

  const userDb = await connectToUserDatabase();
  const collection = userDb.collection("Users");

  let person = await collection.findOne({ email: firstMightyUser.email });

  if (person) {
    const checkpass = await bcrypt.compare("mideMighty001", person.password);

    return { body: `Hello, ${name}!` };
  } else {
    return {
      status: 400,
      body: `Email or password incorrect`,
    };
  }
}

app.http("loginUser", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: loginUser,
});
