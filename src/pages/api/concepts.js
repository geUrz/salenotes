import pool from "@/libs/db"
import dotenv from 'dotenv'

dotenv.config()

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nota_id, descripcion, cantidad, precio } = req.body;

        try {
            const [result] = await pool.query(
                'INSERT INTO conceptos (nota_id, descripcion, cantidad, precio) VALUES (?, ?, ?, ?)',
                [nota_id, descripcion, cantidad, precio]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'GET') {
        const { nota_id } = req.query;

        try {
            const [rows] = await pool.query('SELECT * FROM conceptos WHERE nota_id = ?', [nota_id]);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}