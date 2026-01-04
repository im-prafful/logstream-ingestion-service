import { insertFnc } from "../LogProducer/populator.mjs";
import pg from "pg";
const { Pool } = pg;

// POSTGRES DATABASE
let DB = {
  host: "logstream-2-db.czegikcsabng.ap-south-1.rds.amazonaws.com",
  port: 5432,
  database: "LogStream_2.0",
  user: "masterUser",
  password: "Admin$1234",
  ssl: { rejectUnauthorized: false },
};

const pool = new Pool(DB);

// Helper function to run queries
const query = async (text, params) => {
  return await pool.query(text, params);
};

const localPopulate = async () => {
  try {
    let data = insertFnc();
    const result = await query(`SELECT app_id FROM applications LIMIT 1`);
    const appId = result.rows[0].app_id;

    const insertQuery = `
                INSERT INTO logs (app_id, level, message, source, parsed_data, cluster_id)
                VALUES ($1, $2, $3, $4, $5, NULL)
            `;

    await query(insertQuery, [
      appId,
      data.level,
      data.mssg,
      data.sourceMssg,
      data.parsedData,
    ]);
    console.log("Query sucessfully executed...");
  } catch (e) {
    console.error("Database Error: ", e.message);
  }
};

setInterval(localPopulate, 2000);
