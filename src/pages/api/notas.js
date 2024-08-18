import pool from "@/libs/db";

export default async function handler(req, res) {

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT id, cliente, marca, nota, firma, createdAt FROM notas');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        const { cliente, marca } = req.body;
        try {
            const [result] = await pool.query(
                'INSERT INTO notas (cliente, marca) VALUES (?, ?)',
                [cliente, marca]
            );
            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        const { nota, firma } = req.body

        try {
            let query = 'UPDATE notas SET nota = ?';
            const params = [nota];
            
            if (firma) {
                query += ', firma = ?';
                params.push(firma);
            }

            query += ' WHERE id = ?';
            params.push(id);

            const [result] = await pool.query(query, params);

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Nota actualizada correctamente' });
            } else {
                res.status(404).json({ message: 'Nota no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    } else if (req.method === 'DELETE') {
        const { id } = req.query;
        try {
            const [result] = await pool.query(
                'DELETE FROM notas WHERE id = ?',
                [id]
            );

            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Nota eliminada correctamente' });
            } else {
                res.status(404).json({ message: 'Nota no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
