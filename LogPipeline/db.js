import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

// 🧭 Resolve the absolute path to .env (project root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') }); // .env is in same dir as db.js

console.log('🌍 ENV:', process.env.DB_HOST, process.env.DB_PORT);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
    ssl: {
    require: true,
    rejectUnauthorized: false
  }// disable SSL since you’re tunneling through bastion
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL!'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

const query = async (text) => {
  try {
    const result = await pool.query(text);
    return result;
  } catch (err) {
    console.error('Error executing query:', err);
  }
};

export default query;
