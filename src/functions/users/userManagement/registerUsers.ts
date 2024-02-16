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
import { firstMightyUser } from "../../../../utils/userStructure";
import { verifyEmail } from "../../../../utils/sendGrid";

const moment = require("moment");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export async function registerUsers(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  // context.log(`Http function processed request for url "${request.url}"`);

  // const name = request.query.get("name") || (await request.text()) || "world";

  const userDb = await connectToUserDatabase();
  const collection = userDb.collection("Users");

  let person = await collection.findOne({ email: firstMightyUser.email });

  if (person) {
    const checkpass = await bcrypt.compare("mideMighty001", person.password);
    return {
      status: 400,
      body: `Account already exist, please log in with ${checkpass}, ${person.password}`,
    };
  } else {
    const hashPassword = await bcrypt.hash(
      firstMightyUser.password,
      saltRounds
    );

    const emailVerificationToken = generateVerificationToken();

    const newArray = {
      ...firstMightyUser,
      password: hashPassword,
      verificationToken: emailVerificationToken,
      tokenExpiration: moment().add(2, "hours").format(),
    };
    await collection.insertMany([newArray]);

    sgMail
      .send(
        verifyEmail(
          firstMightyUser.firstname,
          firstMightyUser.email,
          emailVerificationToken
        )
      )
      .then(() => {
        console.log("Email sent");
      })
      .catch((error: any) => {
        console.error(error);
      });

    return { body: `Hello, ${newArray}!` };
  }

  // return { body: `Hello, ${name}!` };
}

app.http("registerUsers", {
  route: "user/register",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: registerUsers,
});
