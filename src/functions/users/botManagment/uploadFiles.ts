import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BlobServiceClient } from "@azure/storage-blob";
import { dataSource } from "../../../../types/indexTypes";
import { connectToUserDatabase } from "../../../../utils/database";
import moment = require("moment");

export async function uploadFiles(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  //   const name = request.query.get("name") || (await request.text()) || "world";

  const datasourceFiles: dataSource = (await request.json()) as dataSource;

  const { type, data, botId } = datasourceFiles;

  if (type === "document") {
    const connectionString = process.env.AzureWebJobsStorage;
    const containerName = "intelliver-blob";
    const blobName = "example.txt";
    const blobContent = "Hello, Azure Blob Storage!";

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
      // Upload content to Azure Blob Storage
      const uploadBlobResponse = await blockBlobClient.upload(
        blobContent,
        Buffer.byteLength(blobContent)
      );
      context.log(
        `Upload block blob ${blobName} successfully`,
        uploadBlobResponse.requestId
      );
      return {
        body: `Hello, mightymide file created! ${uploadBlobResponse.requestId}`,
      };
    } catch (error) {
      context.log(`Error uploading file to Blob Storage: ${error.message}`);
      return {
        status: 500,
        body: `Error uploading file. ${error.message}`,
      };
    }
  }

  if (type === "text") {
    try {
      const userDb = await connectToUserDatabase();
      const botsCollection = userDb.collection("Bots");
      let botData = await botsCollection.findOne({ botId });

      await botsCollection.updateOne(
        { botId },
        {
          $set: {
            dataSource: {
              text: data,
            },
            lastTrained: moment().toISOString(),
          },
        }
      );

      const returiningObj = {
        botData: {
          ...botData,
          dataSource: {
            text: data,
          },
        },
        message: "Chatbot trained successfully",
      };

      return {
        body: JSON.stringify(returiningObj),
      };
    } catch (error) {
      return {
        status: 500,
        body: `Error uploading file. ${error.message}`,
      };
    }
  }
  //   return { body: `Hello, ${name}!` };
}

app.http("uploadFiles", {
  route: "user/TrainBot",
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: uploadFiles,
});
