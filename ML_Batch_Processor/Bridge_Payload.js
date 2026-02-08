import query from "./db.js";
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";

const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

export const payloadfnc = async () => {
  try {
    // --- STEP 1: THE "BUSY CHECK" (Solves 15-min overlap issue) ---
    // Check if ANY batch is currently processing.
    // If we find one, we STOP. We do not send the new batch yet.
    const busyCheck = await query(
      "SELECT 1 FROM batch_order WHERE status='PROCESSING'",
    );

    if (busyCheck.rows.length > 0) {
      console.log(
        "Pipeline is BUSY (A previous batch is still running). Queueing new batch for later.",
      );
      return; // EXIT. The new batch stays 'PENDING' in the DB for the next run.
    }

    // --- STEP 2: FIND NEXT PENDING BATCH ---
    // We only look for PENDING batches now.
    const batchResult = await query(
      `SELECT * FROM batch_order WHERE status='PENDING' ORDER BY batchid ASC LIMIT 1`,
    );

    if (batchResult.rows.length > 0) {
      // FIX: Define the data variable FIRST
      const batchData = batchResult.rows[0];

      // --- STEP 3: LOCK IT (Update status) ---
      // We mark it PROCESSING immediately so the next 5-min run sees it as "Busy"
      await query(
        "UPDATE batch_order SET status='PROCESSING', last_processed_timestamp=NOW() WHERE batchid=$1",
        [batchData.batchid], // FIX: Using the correct variable name
      );

      // --- STEP 4: INVOKE BRIDGE ---
      const command = new InvokeCommand({
        FunctionName: "BridgeLambda",
        InvocationType: "Event",
        Payload: JSON.stringify(batchData),
      });

      console.log(
        `Invoking BridgeLambda with Batch ID: ${batchData.batchid}...`,
      );
      await lambdaClient.send(command);
      console.log("Invocation command sent.");
    } else {
      console.log("No new PENDING batches to process.");
    }
  } catch (invokeError) {
    console.error("Error in payloadfnc:", invokeError);
  }
};
