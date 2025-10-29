import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,      // from .env
  user: process.env.DB_USER,      // from .env
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 300),
});

export default pool;