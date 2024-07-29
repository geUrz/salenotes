import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: 'viaduct.proxy.rlwy.net',   
  port: 34447,    // Reemplaza con tu host de MySQL
  user: 'root',            // Reemplaza con tu usuario de MySQL
  password: 'gezvgeVigQtQJfkduPfRHQnCAkTHDVZY',    // Reemplaza con tu contraseña de MySQL
  database: 'railway',  // Reemplaza con el nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool  


/* import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Configura la conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;   */