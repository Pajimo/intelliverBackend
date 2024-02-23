import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { connectToUserDatabase } from "../../../../utils/database";

export async function fetchUserBot(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  const userBotId = await request.json();

  const { botId }: any = userBotId;

  try {
    const userDb = await connectToUserDatabase();
    const botsCollection = userDb.collection("Bots");
    let botData = await botsCollection.findOne({ botId });

    const returiningObj = {
      botData,
      message: "Chatbot fetched successfully",
    };

    return {
      body: JSON.stringify(returiningObj),
    };
  } catch (error) {
    return {
      status: 500,
      body: `Error fetching bot. ${error.message}`,
    };
  }
}

app.http("fetchUserBot", {
  route: "user/fetchSingleBot",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: fetchUserBot,
});
