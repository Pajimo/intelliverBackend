import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

const { default: axios } = require("axios");

import OpenAI from "openai";

import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from "uuid";
import { connectToUserDatabase } from "../../../../utils/database";

import moment = require("moment");
import { BlobServiceClient } from "@azure/storage-blob";

export async function createBots(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  const createBotData: any = await request.json();

  // context.log(createBotData, "createbotdata");

  const { userId, botName } = createBotData;

  const newBotId = uuidv4();

  const model = "gpt-3.5-turbo";

  // const usersText = `Our mission is to empower businesses of all sizes to engage with their customers more effectively, efficiently, and personally through our innovative chatbot platform using Artifical intelligence, By providing intuitive, scalable, and intelligent chatbot solutions, we aim to improve customer satisfaction, boost engagement, and drive growth for our clients. We are committed to continual innovation, exceptional service, and delivering measurable results that matter."
  // Our Vision:

  // To revolutionize digital interactions between businesses and their customers through advanced Al-driven chatbot solutions, making every online conversation yield positively as a new lead or a customer retention , thereby setting a new standard for customer engagement and support.
  // `;

  // knowledge base you have been provided with

  const botContent = `You are a helpful assistant who is helpful, clever, and very friendly. Only use the following information to answer questions. If the answer is not included, say exactly "Hmm, I am not sure." and stop after that. Refuse to answer any question not about the info. Never break character.`;

  // { role: "user", content: "Who won the world series in 2020?" },
  // {
  //   role: "assistant",
  //   content: "The Los Angeles Dodgers won the World Series in 2020.",
  // },
  // { role: "user", content: "Where was it played?" },

  // const messages: any = [
  //   {
  //     role: "system",
  //     content: botContent
  //   },
  // ];

  const temperature = 0.1;

  try {
    const userDb = await connectToUserDatabase();
    const botsCollection = userDb.collection("Bots");
    const userCollection = userDb.collection("Users");

    let userData = await userCollection.findOne({ userId });

    const newBotData = {
      content: botContent,
      model,
      userId,
      botId: newBotId,
      botName,
      _id: newBotId,
      dataSource: {
        text: "",
      },
      active: true,
      creationDate: moment().toISOString(),
      integrations: [],
      botPicture: "",
      temperature,
    };

    const userBotData = {
      _id: newBotId,
      botId: newBotId,
      botName,
      botPicture: "",
    };

    await botsCollection.insertOne(newBotData);
    await userCollection.updateOne(
      { _id: userId },
      { $set: { bots: [...userData.bots, userBotData] } }
    );

    const returiningObj = {
      userData: { ...userData, bots: [...userData.bots, userBotData] },
      createdBot: userBotData,
      message: "Bot created successfully",
    };

    return {
      body: JSON.stringify(returiningObj),
    };
  } catch (error) {
    context.log(error);
    return { status: 500, body: "Internal server error." };
  }

  // } chatcmpl-8tq8bHxOBH4n8Wtd5z547kZuCCkkh

  // await agent("What are you?");

  // return { body: `Hello, mightymide` };
}

app.http("createBots", {
  route: "user/createBot",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: createBots,
});
