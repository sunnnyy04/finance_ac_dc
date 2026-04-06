import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Successfully connected to database:', res.rows[0]);
    await pool.end();
  } catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
}

test();
