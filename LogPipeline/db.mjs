// db.mjs (Cleaned to rely only on environment variables from local_env.json)
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Setting ssl: false is recommended for local tunneling, or use your ENV variable
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }, // disable SSL since you’re tunneling through bastion
});

const query = async (text, params) => {
  try {
    console.log(
      "🔗 Attempting to connect to DB at:",
      process.env.DB_HOST,
      "Port:",
      process.env.DB_PORT
    );

    const result = await pool.query(text);
    return result;
  } catch (err) {
    console.error("❌ Error executing query:", err.message);
    throw err;
  }
};

export default query;
