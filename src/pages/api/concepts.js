import pool from "@/libs/db";
import dotenv from 'dotenv';

dotenv.config()

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nota_id, tipo, concepto, cantidad, precio } = req.body

        try {
            const [result] = await pool.query(
                'INSERT INTO conceptos (nota_id, tipo, concepto, cantidad, precio) VALUES (?, ?, ?, ?, ?)',
                [nota_id, tipo, concepto, cantidad, precio]
            );
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'GET') {
        const { nota_id } = req.query

        try {
            const [rows] = await pool.query('SELECT * FROM conceptos WHERE nota_id = ?', [nota_id]);
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { concept_id } = req.query

        try {
            const [result] = await pool.query('DELETE FROM conceptos WHERE id = ?', [concept_id])
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' })
            }
            res.status(200).json({ message: 'Concepto eliminado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'PUT') {
        const { id } = req.query
        const { tipo, concepto, cantidad, precio } = req.body

        try {
            const [result] = await pool.query(
                'UPDATE conceptos SET tipo = ?, concepto = ?, cantidad = ?, precio = ? WHERE id = ?',
                [tipo, concepto, cantidad, precio, id]
            );
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Concepto no encontrado' })
            }
            res.status(200).json({ message: 'Concepto actualizado exitosamente' })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
