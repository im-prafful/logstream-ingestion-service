import query from "../../db.js";
import {
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";


const sqsClient = new SQSClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const QUEUE_URL = 'https://sqs.ap-south-1.amazonaws.com/031415497613/SQS_LogIngestion'

let dbLogs = []//empty array to store the logs fetched from  SQS


//---------FETCH FROM SQS-----------------
const fetchData = async () => {
  //wrapping (insert in db + delete from sqs in one logical transaction to minimize duplicacy errors)
  console.log("--- Listening for messages from SQS...");

  while (true) {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 5,
        VisibilityTimeout: 30
      });

      const response = await sqsClient.send(command);
      const messages = response.Messages || [];

      if (messages.length > 0) {
        console.log(`[OK] Received ${messages.length} messages`);
        //insert mssgs in temporary storage
        for (const msg of messages) {
          dbLogs.push(JSON.parse(msg.Body))
        }

        // Delete processed messages
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
      } else {
        console.log(" No new messages. Stopping listener...");
        break;
      }
    } catch (err) {
      console.error("[ERROR] Error receiving messages:", err.message);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // retry delay
    }
  }
}


//--------INSERT INTO POSTGRES----------
const insertData = async () => {
  try {
    // get app_id from application table
    const result = await query(`SELECT app_id from applications LIMIT 1;`)
    if (result.rows.length === 0) {
      throw new Error("No API key found in application table");
    }
    const app_id = result.rows[0].app_id;

    if(dbLogs.length===0){
      return 0
    }

    for (const log of dbLogs) { 
      try { 
        await query(`INSERT INTO logs (app_id, level, message, source, parsed_data, pattern_id)
            VALUES(
            '${app_id}',
            '${log.level}',
            '${log.mssg}',
            '${log.sourceMssg}',
            '${log.parsedData}',
            NULL
            )
            `)
            console.log(`[INSERT SUCCESSFULL]`)
      } catch (insertErr) {
        
        console.error(`[INSERT FAILED] Failed to insert log: ${insertErr.message}. Data: ${JSON.stringify(log)}`);
      }
    }
    // Clear the processed logs *only after* the insertion loop completes successfully
    dbLogs = []; 

  } catch (err) {
    console.error("[ERROR] Error in insertData function (outside loop, possibly DB connect or app_id fetch):", err.message);
  }
}

(async function runPipeline() {
  while (true) {
    try {
      //console.log("Fetching + inserting logs...");
      await fetchData();
      let x=await insertData();
      if(x===0){
         console.log(`Queue empty.....exiting`)  
         process.exit(0)
      }

      console.log("Cycle complete. Waiting 10s...");
      await new Promise((resolve) => setTimeout(resolve, 10000));//each cycle waits 10s before starting the next
    } catch (err) {
      console.error("Pipeline error:", err.message);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // wait before retry
    }
  }
})();

