import query from "../config/db";
import { insertFnc } from "../utils/logHelper";
import { LogEntry } from "../types/log.types";

const insertData = async (): Promise<void> => {
  try {
    const result = await query(`SELECT app_id FROM applications LIMIT 1;`);

    if (!result?.rows?.length) {
      throw new Error("No app_id found in the applications table");
    }

    const appId: string = result.rows[0].app_id;

    const logData: LogEntry = insertFnc(); 

    await query(
      `INSERT INTO logs (app_id, level, message, source, parsed_data, pattern_id)
       VALUES ($1, $2, $3, $4, $5, NULL);`,
      [appId, logData.level, logData.mssg, logData.sourceMssg, logData.parsedData]
    );

    console.log("Log entry inserted successfully.");
  } catch (err: any) {
    console.error("Error inserting log entry:", err.message);
  } finally {
    setInterval(insertData, 3000);
  }
};

insertData();
