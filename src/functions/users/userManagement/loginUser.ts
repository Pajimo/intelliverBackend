import {
  app,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToUserDatabase } from "../../../../utils/database";
import { userRegistrationStructure } from "../../../../utils/userStructure";

import bcrypt = require("bcryptjs");
import { loginData } from "../../../../types/indexTypes";
import { generateToken } from "../../../../utils/constants";
import { validateToken } from "../../../../utils/validateToken";

export async function loginUser(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  context.log(request.headers.getSetCookie(), "cookie here");

  const loginData: loginData = (await request.json()) as loginData;

  // context.log(loginData, "body");

  // const user = await validateToken(request);

  // context.log(user, "userthingssss");

  if (request.method === "OPTIONS") {
    return {
      // No body needed for preflight response
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    };
  }

  const { email, password } = loginData;

  const userDb = await connectToUserDatabase();
  const collection = userDb.collection("Users");

  let person = await collection.findOne({ email });

  if (!person) {
    return {
      status: 400,
      body: `Email or password incorrect`,
    };
  }

  if (!person.emailVerification) {
    return {
      status: 400,
      body: `Please verify your email address`,
    };
  }

  const checkpass = await bcrypt.compareSync(password, person.password);

  if (!checkpass) {
    return {
      status: 400,
      body: `password incorrect`,
    };
  }
  const userToken = generateToken(person.userId);
  // await collection.updateOne(
  //   { _id: person._id },
  //   { $set: { userToken: userToken } }
  // );
  const returiningObj = {
    ...person,
    message: "Log in successful",
    status: "sucess",
  };

  // const response = new HttpResponse({ body: `Hello, world!` });
  // response.headers.set("content-type", "application/json");
  // response.headers.set(
  //   "Set-Cookie",
  //   `token=${userToken}; HttpOnly; SameSite=None; Path=/`
  // );
  // return response;

  return {
    body: JSON.stringify(returiningObj),
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3000", // Specify the requesting origin
      "Access-Control-Allow-Credentials": "true", // Allow credentials
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Adjust based on your needs
      "Access-Control-Allow-Headers": "Content-Type, Authorization", // Required headers
      "Content-Type": "application/json",
      "Set-Cookie": `token=${userToken}; HttpOnly; ${
        process.env.NODE_ENV === "dev" ? "" : "Secure;"
      } SameSite=None; Path=/`,
    },
  };
}

app.http("loginUser", {
  route: "user/login",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: loginUser,
});
