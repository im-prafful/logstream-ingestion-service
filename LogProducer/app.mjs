import { insertFnc } from "./populator.mjs";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({});
const QUEUE_URL = process.env.SQS_QUEUE_URL;

export const handler = async (event) => {
  const logsToGenerate = 20;
  let successCount = 0;

  console.log(
    `Starting to generate ${logsToGenerate} Semantic Logs (70/30 Split)...`
  );

  for (let i = 0; i < logsToGenerate; i++) {
    const log = insertFnc();

    if (!log.level || !log.mssg || !log.sourceMssg) {
      console.warn("Skipping malformed log generation");
      continue;
    }

    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(log),
    });

    try {
      await sqsClient.send(command);
      successCount++;
    } catch (err) {
      console.error(`[SQS FAIL] Log ${i + 1}:`, err.message);
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Generated ${successCount} semantic logs.`,
    }),
  };
};
