import {
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import pg from "pg";
const { Pool } = pg;

// ==========================================
// 1. HARDCODED CONFIGURATION
// ==========================================
const CONFIG = {
  // AWS SQS
  REGION: "ap-south-1",
  QUEUE_URL:
    "https://sqs.ap-south-1.amazonaws.com/031415497613/SQS_LogIngestion",

  // POSTGRES DATABASE
  DB: {
    host: "logstream-2-db.czegikcsabng.ap-south-1.rds.amazonaws.com",
    port: 5432,
    database: "LogStream_2.0",
    user: "masterUser",
    password: "Admin$1234",
    ssl: { rejectUnauthorized: false }, // Required for RDS in most cases
  },
};

// ==========================================
// 2. CLIENT INITIALIZATION
// ==========================================

// Initialize AWS SQS
const sqsClient = new SQSClient({ region: CONFIG.REGION });

// Initialize Postgres Pool (Replaces db.mjs)
const pool = new Pool(CONFIG.DB);

// Helper function to run queries
const query = async (text, params) => {
  return await pool.query(text, params);
};

// ==========================================
// 3. PIPELINE LOGIC
// ==========================================

let dbLogs = [];
let failedLogs = [];
let isProcessing = false;

// --- FETCH FROM SQS ---
const fetchData = async () => {
  try {
    const command = new ReceiveMessageCommand({
      QueueUrl: CONFIG.QUEUE_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 1,
      VisibilityTimeout: 60,
    });

    const response = await sqsClient.send(command);
    const messages = response.Messages || [];

    if (messages.length > 0) {
      console.log(`[SQS] Received ${messages.length} messages`);

      for (const msg of messages) {
        try {
          dbLogs.push(JSON.parse(msg.Body));
        } catch (parseErr) {
          console.error(`[PARSE ERROR] ${parseErr.message}`);
          failedLogs.push({ error: parseErr.message, raw: msg.Body });
        }
      }
    }
    return messages;
  } catch (err) {
    console.error("[SQS ERROR]", err.message);
    return [];
  }
};

// --- INSERT INTO DB ---
const insertData = async (app_id) => {
  if (dbLogs.length === 0) return 0;

  let successCount = 0;
  console.log(`[DB] Attempting to insert ${dbLogs.length} logs...`);

  for (const log of dbLogs) {
    try {
      // Using parameterized query for safety, even in testing
      const insertQuery = `
                INSERT INTO logs (app_id, level, message, source, parsed_data, cluster_id)
                VALUES ($1, $2, $3, $4, $5, NULL)
            `;

      await query(insertQuery, [
        app_id,
        log.level,
        log.mssg,
        log.sourceMssg,
        log.parsedData,
      ]);

      successCount++;
    } catch (insertErr) {
      console.error(`[INSERT ERROR] ${insertErr.message}`);
    }
  }

  // Log success message if any were inserted
  if (successCount > 0)
    console.log(`[DB] Successfully inserted ${successCount} logs.`);

  dbLogs = []; // Clear array
  return successCount;
};

// --- DELETE FROM SQS ---
const deleteMessages = async (messagesToDelete) => {
  if (messagesToDelete.length === 0) return;

  try {
    const entries = messagesToDelete.map((msg) => ({
      Id: msg.MessageId,
      ReceiptHandle: msg.ReceiptHandle,
    }));

    await sqsClient.send(
      new DeleteMessageBatchCommand({
        QueueUrl: CONFIG.QUEUE_URL,
        Entries: entries,
      })
    );

    console.log(`[SQS] Deleted ${entries.length} messages.`);
  } catch (err) {
    console.error("[SQS DELETE ERROR]", err.message);
  }
};

// ==========================================
// 4. MAIN EXECUTION CYCLE
// ==========================================

const runCycle = async (app_id) => {
  if (isProcessing) {
    process.stdout.write("."); // Visual indicator that it's busy/skipping
    return;
  }
  isProcessing = true;

  try {
    // 1. Fetch
    const messages = await fetchData();

    // 2. Insert (only if we have data)
    if (messages.length > 0) {
      await insertData(app_id);
      // 3. Delete
      await deleteMessages(messages);
    }
  } catch (error) {
    console.error("CRITICAL CYCLE ERROR:", error);
  } finally {
    isProcessing = false;
  }
};

// ==========================================
// 5. STARTUP
// ==========================================

const startPoller = async () => {
  console.log(">>> STARTING LOCAL POLLER (Credentials Hardcoded) <<<");
  console.log(`>>> Target DB: ${CONFIG.DB.host}`);

  try {
    // Fetch App ID once
    const appRes = await query(`SELECT app_id from applications LIMIT 1;`);

    if (appRes.rows.length === 0) {
      console.error("!!! NO APPLICATION FOUND IN DB !!!");
      process.exit(1);
    }

    const app_id = appRes.rows[0].app_id;
    console.log(`>>> Using App ID: ${app_id}`);
    console.log(">>> Polling every 3 seconds...");

    // Start Loop
    setInterval(() => runCycle(app_id), 3000);

    // Run first cycle immediately
    runCycle(app_id);
  } catch (err) {
    console.error("Startup Failed (Check DB Connection):", err.message);
    process.exit(1);
  }
};

startPoller();
