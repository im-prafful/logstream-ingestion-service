import express from "express";
import query from "./db.js";

import query from "./db.js";

export const createLogBatch = async () => {
  try {
    await query("BEGIN");

    // 1. CHECK: Get the last max ID from our batch table
    const checkQuery = `SELECT MAX(endlogid) as last_max_id FROM batch_order`;
    const checkResult = await query(checkQuery);
    let lastMaxId = checkResult.rows[0].last_max_id;

    let logQuery = "";

    // --- IF / ELSE LOGIC START ---

    if (!lastMaxId) {
      // CASE 1: FIRST TIME RUN (Table is empty)
      console.log("First run detected. Fetching initial batch...");

      logQuery = `
                WITH t AS (
                    SELECT logid
                    FROM logs
                    WHERE level IN ('error','warning') 
                    AND cluster_id IS NULL
                    ORDER BY logid ASC
                    LIMIT 500
                )
                SELECT 
                    (SELECT min(logid) FROM t) as first_log_id,
                    (SELECT max(logid) FROM t) as last_log_id,
                    count(*) as batch_size
                FROM t
            `;
    } else {
      // CASE 2: SUBSEQUENT RUNS
      // Interpolate the ID directly into the string
      console.log(`Fetching next batch after log ID: ${lastMaxId}`);

      logQuery = `
                WITH t AS (
                    SELECT logid
                    FROM logs
                    WHERE level IN ('error','warning') 
                    AND cluster_id IS NULL
                    AND logid > ${lastMaxId} 
                    ORDER BY logid ASC
                    LIMIT 500
                )
                SELECT 
                    (SELECT min(logid) FROM t) as first_log_id,
                    (SELECT max(logid) FROM t) as last_log_id,
                    count(*) as batch_size
                FROM t
            `;
    }

    // --- IF / ELSE LOGIC END ---

    // 2. Execute the query
    const results = await query(logQuery);

    // 3. Validation
    if (results.rows.length === 0 || results.rows[0].batch_size < 500) {
      console.log("Not enough logs for a full batch. Rolling back.");
      await query("ROLLBACK");
      return;
    }

    const firstId = results.rows[0].first_log_id;
    const lastId = results.rows[0].last_log_id;

    // 4. Insert into Batch Order using direct string interpolation
    const insertQuery = `
            INSERT INTO batch_order (startlogid, endlogid, status)
            VALUES (${firstId}, ${lastId}, 'PROCESSING')
        `;

    const insertRes = await query(insertQuery);

    await query("COMMIT");

    console.log(`Success! Batch ${insertRes.rows[0].batchid} created.`);
    return insertRes.rows[0];
  } catch (e) {
    console.error("Error creating batch:", e);
    await query("ROLLBACK");
    throw e;
  }
};
