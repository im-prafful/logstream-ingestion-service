import query from "./db.js";
import { launchEcsTask } from "./ecs_task.js";

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

            const batchData = batchResult.rows[0];
            const { batchid, startlogid, endlogid } = batchData;

            await query(
                "UPDATE batch_order SET status='PROCESSING', last_processed_timestamp=NOW() WHERE batchid=$1",
                [batchData.batchid],
            );

            // --- STEP 4: TRIGGER ECS TASK VIA HELPER ---
            try {
                await launchEcsTask(batchid, startlogid, endlogid);
            } catch (err) {
                console.error(`Failed to launch ECS Task for Batch ${batchid}:`, err);
                // Mark FAILED so it doesn't loop infinitely without attention
                await query(`UPDATE batch_order SET status = 'FAILED' WHERE batchid = ${batchid}`);
                throw err;
            }

        } else {
            console.log("No new PENDING batches to process.");
        }
    } catch (invokeError) {
        console.error("Error in payloadfnc:", invokeError);
    }
};
