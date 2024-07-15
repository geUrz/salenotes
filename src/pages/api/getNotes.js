import pool from "@/libs/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM notes')
    res.status(200).json(rows || [])
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
} 