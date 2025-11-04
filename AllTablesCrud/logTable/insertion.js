import query from "../../db.js";
import {insertFnc} from "../../populator.js"

const insertData = async () => {
  try {
    // get app_id from application table
    const result = await query(`SELECT app_id FROM applications LIMIT 1;`);
    if (result.rows.length === 0) {
      throw new Error("No API key found in application table");
    }

    const app_id = result.rows[0].app_id;

    let obj = insertFnc();

    await query(`
      INSERT INTO logs (app_id, level, message, source, parsed_data, pattern_id)
      VALUES (
        '${app_id}',
        '${obj.level}',
        '${obj.mssg}',
        '${obj.sourceMssg}',
        '${obj.parsedData}',
        NULL
      );
    `);

    console.log("Log entry inserted successfully.");
  } catch (err) {
    console.error("Error inserting log entry:", err.message);
  }
};

setInterval(() => {
  insertData();
}, 5000);
