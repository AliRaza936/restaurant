// db.js
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

// Create MySQL connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,  // default MySQL port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,   // adjust if needed
  queueLimit: 0
});

// ✅ Test connection
const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ Connected to MySQL database');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
};

testConnection(); // runs when app starts

export default db;
