import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import OpenAI from "openai";
import { connectToUserDatabase } from "../../../../utils/database";

export async function messagingChatBot(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);
  const botConfig: any = await request.json();

  const { botId, userMessage } = botConfig;

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  try {
    const userDb = await connectToUserDatabase();
    const botsCollection = userDb.collection("Bots");
    const userConverstation = userDb.collection("Conversations");
    let botData = await botsCollection.findOne({ botId });

    const { temperature, model, botContent, dataSource } = botData;

    let convoData = await userConverstation.findOne({ convoId: botId });

    // context.log(botData, "convoData");

    const messages: any = convoData
      ? convoData.messages
      : [
          {
            role: "system",
            content: botContent + dataSource?.text,
          },
        ];

    // { role: "user", content: "Who won the world series in 2020?" },
    // {
    //   role: "assistant",
    //   content: "The Los Angeles Dodgers won the World Series in 2020.",
    // },
    // { role: "user", content: "Where was it played?" },

    //   const messages: any = [
    //     {
    //       role: "system",
    //       content: botContent
    //     },
    //   ];
    messages.push({
      role: "user",
      content: userMessage,
    });
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature,
    });

    messages.push({
      role: "system",
      content: response.choices[0].message.content,
    });

    // this is for when convoData is empty, setting the base
    if (convoData) {
      // using
      await userConverstation.updateOne(
        { _id: convoData._id },
        { $set: { messages } }
      );
    } else {
      const newConvoStructure = {
        _id: botId,
        convoId: botId,
        messages,
      };

      await userConverstation.insertOne(newConvoStructure);
    }

    console.log(response.choices[0].message.content);

    const returiningObj = {
      botMessage: response.choices[0].message.content,
      message: "replied successfully",
    };

    return {
      body: JSON.stringify(returiningObj),
    };
  } catch (error) {
    return { status: 400, body: `Error ${error}!` };
  }
}

app.http("messagingChatBot", {
  route: "user/messagingBot",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: messagingChatBot,
});
