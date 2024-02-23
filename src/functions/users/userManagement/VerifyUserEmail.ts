import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToUserDatabase } from "../../../../utils/database";
import moment = require("moment");
import { redirectUrl } from "../../../../utils/constants";

export async function VerifyUserEmail(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const token = request.query.get("token") || (await request.text()) || "world";

  const userDb = await connectToUserDatabase();
  const collection = userDb.collection("Users");

  let person = await collection.findOne({ verificationToken: token });

  // if the token doesnt exist by checking if any user has it in his document
  if (!person) {
    return {
      status: 400,
      body: `Invalid token`,
    };
  }

  // if the token exist but it has expired by checking tokenExpiration with current time (2hrs)
  const now = moment().format();

  if (now > person.tokenExpiration) {
    return {
      status: 400,
      body: `Token Expired`,
    };
  }

  // if the token exist, set emailVerificstion === true
  await collection.updateOne(
    { _id: person._id },
    { $set: { emailVerification: true } }
  );

  // and then remove the token and the toeken expiration from the users document
  // for added security, once verified no need again
  await collection.updateOne(
    { _id: person._id },
    { $unset: { verificationToken: "", tokenExpiration: "" } }
  );

  return {
    status: 301,
    body: `Email for ${person.firstName} verified!`,
    headers: {
      // Set the Location header to the redirect destination
      Location: redirectUrl,
    },
  };
}

app.http("VerifyUserEmail", {
  route: "user/verifyEmail",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: VerifyUserEmail,
});
