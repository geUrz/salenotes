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
            )
            res.status(201).json({ id: result.insertId })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'GET') {
        const { nota_id, nota_ids } = req.query

        try {
            let query = 'SELECT * FROM conceptos'
            let params = []

            if (nota_ids) {
                // Handle multiple nota_ids
                const ids = nota_ids.split(',').map(id => parseInt(id, 10)); // Convert to integers
                query += ' WHERE nota_id IN (?)';
                params.push(ids);
            } else if (nota_id) {
                // Handle single nota_id
                query += ' WHERE nota_id = ?';
                params.push(nota_id);
            }

            const [rows] = await pool.query(query, params)
            res.status(200).json(rows)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    } else if (req.method === 'DELETE') {
        const { concepto_id } = req.query

        try {
            const [result] = await pool.query('DELETE FROM conceptos WHERE id = ?', [concepto_id])
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
