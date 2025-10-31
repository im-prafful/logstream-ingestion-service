import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

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
  }
});


pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL!'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

