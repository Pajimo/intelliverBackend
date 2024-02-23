import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

import { connectToUserDatabase } from "../../../../utils/database";
import {
  generateVerificationToken,
  saltRounds,
} from "../../../../utils/constants";
import { userRegistrationStructure } from "../../../../utils/userStructure";
import { verifyEmail } from "../../../../utils/sendGrid";

import moment = require("moment");
import bcrypt = require("bcryptjs");
import sgMail = require("@sendgrid/mail");
import { signinData } from "../../../../types/indexTypes";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export async function registerUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // context.log(`Http function processed request for url "${request.url}"`);

  // const name = request.query.get("name") || (await request.text()) || "world";

  if (request.method !== "POST") {
    return {
      status: 405,
      body: `This endpoint accepts only POST requests.`,
    };
  }

  const loginData: signinData = (await request.json()) as signinData;

  context.log(loginData, "body");

  const { email, password, firstName, lastName } = loginData;

  if (!email || !password || !firstName || !lastName) {
    return {
      status: 400,
      body: `All fields are required`,
    };
  }

  try {
    const userDb = await connectToUserDatabase();
    const collection = userDb.collection("Users");

    let existingUser = await collection.findOne({ email });

    if (existingUser) {
      if (existingUser.emailVerification) {
        return {
          status: 400,
          body: `Verify your email`,
        };
      }
      return {
        status: 400,
        body: `Account already exist`,
      };
    }
    const hashedPassword = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(saltRounds)
    );

    const emailVerificationToken = generateVerificationToken();
    const newArray = {
      ...userRegistrationStructure,
      firstName,
      lastName,
      password: hashedPassword,
      email,
      emailVerificationToken,
      tokenExpiration: new Date(moment().add(2, "hours").toISOString()),
    };
    await collection.insertOne([newArray]);

    sgMail
      .send(verifyEmail(firstName, email, emailVerificationToken))
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: any) => {
        console.error(error);
      });

    return { body: `Please verify your email address ${email}!` };
  } catch (error) {
    console.error("Registration error:", error);
    return { status: 500, body: "Internal server error." };
  }

  // return { body: `Hello, ${name}!` };
}

app.http("registerUsers", {
  route: "user/register",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: registerUsers,
});
