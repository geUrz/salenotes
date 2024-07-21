/* import pool from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT * FROM notes');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        const { client_id, description } = req.body;

        try {
            const [result] = await pool.query(
                'INSERT INTO notes (client_id, description) VALUES (?, ?)',
                [client_id, description]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} */

    import pool from "@/libs/db";

    export default async function handler(req, res) {
        if (req.method === 'GET') {
            try {
                const [rows] = await pool.query('SELECT * FROM notas');
                res.status(200).json(rows);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else if (req.method === 'POST') {
            const { titulo, descripcion } = req.body;
    
            try {
                const [result] = await pool.query(
                    'INSERT INTO notas (titulo, descripcion) VALUES (?, ?)',
                    [titulo, descripcion]
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