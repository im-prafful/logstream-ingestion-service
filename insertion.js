import query from "./db.js";
import {
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
  SQSClient,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";


const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const QUEUE_URL =
  "https://sqs.ap-south-1.amazonaws.com/031415497613/SQS_LogIngestion";

let dbLogs = []; //empty array to store the logs fetched from  SQS
let failedLogs = [];



//---------FETCH FROM SQS-----------------
export const fetchData = async () => {
  console.log("--- Listening for messages from SQS...");

  while (true) {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 5,
        VisibilityTimeout: 30,
      });

      const response = await sqsClient.send(command);
      const messages = response.Messages || [];

      if (messages.length === 0) {
        console.log("No new messages. Stopping listener...");
        break;
      }

      console.log(`[OK] Received ${messages.length} messages`);

      //retreive messages
      for (const msg of messages) {
        try {
          dbLogs.push(JSON.parse(msg.Body));
        } catch (parseErr) {
          console.error(
            `[PARSE FAILED] Message ID ${msg.MessageId}: ${parseErr.message}`
          );
          failedLogs.push({
            error: `Parse Failed: ${parseErr.message}`,
            data: msg.Body,
          });
        }
      }

      // Only delete if messages exist
      if (messages.length > 0) {
        const deleteParams = {
          QueueUrl: QUEUE_URL,
          Entries: messages.map((msg) => ({
            Id: msg.MessageId,
            ReceiptHandle: msg.ReceiptHandle,
          })),
        };

        const deleteCommand = new DeleteMessageBatchCommand(deleteParams);
        await sqsClient.send(deleteCommand);
        console.log(`[DEL] Deleted ${messages.length} messages from queue`);
      }
    } catch (err) {
      console.error("[ERROR] Error receiving messages:", err.message);
    }
  }
};

//--------INSERT INTO POSTGRES----------
export const insertData = async () => {
  try {
    // get app_id from application table
    const result = await query(`SELECT app_id from applications LIMIT 1;`);
    if (result.rows.length === 0) {
      throw new Error("No API key found in application table");
    }
    const app_id = result.rows[0].app_id;

    if (dbLogs.length === 0) {
      return 0;
    }

    for (const log of dbLogs) {
      try {
        await query(`INSERT INTO logs (app_id, level, message, source, parsed_data, cluster_id)
            VALUES(
            '${app_id}',
            '${log.level}',
            '${log.mssg}',
            '${log.sourceMssg}',
            '${log.parsedData}',
            NULL
            )
            `);
        console.log(`[INSERT SUCCESSFULL]`);
      } catch (insertErr) {
        failedLogs.push({
          error: `INSERT Failed: ${insertErr.message}`,
          data: log, // Store the raw body of the failed message
        });
        console.error(
          `[INSERT FAILED] Failed to insert log: ${
            insertErr.message
          }. Data: ${JSON.stringify(log)}`
        );
      }
    }
    // Clear the processed logs *only after* the insertion loop completes successfully
    dbLogs = [];
  } catch (err) {
    console.error(
      "[ERROR] Error in insertData function (outside loop, possibly DB connect or app_id fetch):",
      err.message
    );
  }
};

export const handleFailedLogs = async () => {
  if (failedLogs.length === 0) return 0;

  // get app_id from application table
  const result = await query(`SELECT app_id from applications LIMIT 1;`);
  if (result.rows.length === 0) {
    throw new Error("No API key found in application table");
  }
  const app_id = result.rows[0].app_id;

  //retry failed logs
  for (const log of failedLogs) {
    try {
      await query(`INSERT INTO logs (app_id, level, message, source, parsed_data, cluster_id)
            VALUES(
            '${app_id}',
            '${log.data.level}',
            '${log.data.mssg}',
            '${log.data.sourceMssg}',
            '${log.data.parsedData}',
            NULL
            )
            `);
      console.log(`[INSERT SUCCESSFULL AFER RETRYING]`);
    } catch (err) {
      console.log(`[ERROR]  INSERT failed even after retrying....`);
    }
  }
  failedLogs = []; //reinitialize after processing...
  return 1;
};


