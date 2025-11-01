import dotenv from "dotenv";
import { Pool, QueryResult } from "pg";
import { DBConfig } from "../types/db.types";

dotenv.config();

export type QueryResultRow = Record<string, any>;

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

if (!DB_HOST || !DB_PORT || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Missing required database environment variables.");
}

const poolConfig: DBConfig = {
  host: DB_HOST,
  port: Number(DB_PORT),
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
};

const pool = new Pool(poolConfig);

console.log("ENV:", DB_HOST, DB_PORT);

pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL!"))
  .catch((err) => console.error("Database connection failed:", err.message));

export const query = async <T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | undefined> => {
  try {
    const result = await pool.query<T>(text, params);
    return result;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
};

export { pool };
export default query;
