import pool from "@/libs/db";
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { simple } = req.query;

        try {
            let query = '';
            let params = [];

            if (simple) {
                query = 'SELECT id, descripcion, createdAt, cliente_id FROM notas';
            } else {
                query = `
                    SELECT 
                        notas.id, 
                        notas.descripcion, 
                        notas.createdAt, 
                        clientes.cliente AS cliente
                    FROM 
                        notas
                    JOIN 
                        clientes 
                    ON 
                        notas.cliente_id = clientes.id
                `;
            }

            const [rows] = await pool.query(query, params);
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        const { cliente_id, descripcion } = req.body;

        try {
            const [result] = await pool.query(
                'INSERT INTO notas (cliente_id, descripcion) VALUES (?, ?)',
                [cliente_id, descripcion]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}


