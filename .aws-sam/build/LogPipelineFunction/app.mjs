// LogPipeline/app.js (Runs all logic in a single cycle)
import query from "./db.mjs"; // Your existing db.js
import {
    ReceiveMessageCommand,
    DeleteMessageBatchCommand,
    SQSClient,
} from "@aws-sdk/client-sqs";


const sqsClient = new SQSClient({});

// URL comes from the SAM template.yaml Environment Variables
const QUEUE_URL = process.env.SQS_QUEUE_URL;


// These arrays will be instantiated on every cold start of the Lambda
let dbLogs = [];
let failedLogs = [];

// --------- 1. FETCH FROM SQS (Single Cycle) -----------------
const fetchData = async () => {
    console.log("--- Starting single cycle fetch from SQS...");

    // Lambda runs the logic once; no while(true) loop
    try {
        const command = new ReceiveMessageCommand({
            QueueUrl: QUEUE_URL,
            MaxNumberOfMessages: 10, 
            VisibilityTimeout: 60,
        });

        const response = await sqsClient.send(command);
        const messages = response.Messages || [];

        if (messages.length === 0) {
            console.log("No new messages found in this cycle.");
            return []; // Return empty array of messages to delete
        }

        console.log(`[OK] Received ${messages.length} messages`);

        // Retrieve messages and populate dbLogs/failedLogs
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

        // Return all messages received so they can be deleted (successful and failed parsing)
        return messages;

    } catch (err) {
        console.error("[ERROR] Error receiving messages:", err.message);
        return [];
    }
};

// --------- 2. DELETE FROM SQS -----------------
const deleteMessages = async (messagesToDelete) => {
    if (messagesToDelete.length === 0) return;

    try {
        const deleteParams = {
            QueueUrl: QUEUE_URL,
            // Map includes messages that were successfully parsed OR failed parsing
            Entries: messagesToDelete.map((msg) => ({
                Id: msg.MessageId,
                ReceiptHandle: msg.ReceiptHandle,
            })),
        };

        const deleteCommand = new DeleteMessageBatchCommand(deleteParams);
        await sqsClient.send(deleteCommand);
        console.log(`[DEL] Successfully deleted ${messagesToDelete.length} messages.`);
    } catch (err) {
        // If delete fails, messages will reappear after VisibilityTimeout
        console.error("[DEL ERROR] Failed to delete messages:", err.message);
    }
}


// -------- 3. INSERT INTO POSTGRES (using string concatenation) ----------
const insertData = async (app_id,c) => {
    console.log("--- Starting database insertion...");
    if (dbLogs.length === 0) return 0;

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
                c=c+1//increment successfull insertion count
             console.log(`[INSERT SUCCESSFULL]`);
        } catch (insertErr) {
            failedLogs.push({
                error: `INSERT Failed: ${insertErr.message}`,
                data: log,
            });
            console.error(`[INSERT FAILED] Failed to insert log: ${insertErr.message}`);
        }
    }
    dbLogs = []; // Clear the processed logs
    return c;
};

// -------- 4. HANDLE FAILED LOGS (Retry using string concatenation) ----------
const handleFailedLogs = async (app_id) => {
    if (failedLogs.length === 0) return 0;
    console.log(`--- Starting retry for ${failedLogs.length} failed logs...`);

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
            console.log(`[ERROR] INSERT failed even after retrying. Dropping log.`);
        }
    }
    failedLogs = []; // reinitialize after processing
    return 1;
};


// ----------------- LAMBDA HANDLER (The entry point) -----------------

export const handler = async (event) => {
    console.log("--- Starting Full Pipeline Execution Cycle ---");

    try {
        // 1. Get App ID (Must be done first in every cycle)
        const appResult = await query(`SELECT app_id from applications LIMIT 1;`);
        if (appResult.rows.length === 0) {
            throw new Error("No API key found in application table. Halting.");
        }
        const app_id = appResult.rows[0].app_id;

        // 2. Fetch Messages from SQS and Populate dbLogs/failedLogs
        const messagesToClear = await fetchData();

        // 3. Insert Logs into Postgres
        let x=await insertData(app_id,0);

        // 4. Retry failed logs
        //await handleFailedLogs(app_id);

        // 5. Delete ALL processed messages (original logic)
        await deleteMessages(messagesToClear);

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: "Pipeline Cycle Complete",
                logsFetched: messagesToClear.length,
                logsInserted:x
            }),
        };
    } catch (criticalErr) {
        console.error("FATAL PIPELINE ERROR:", criticalErr.message);
        throw criticalErr; // Ensure the Lambda reports failure
    }
};