import pool from "@/libs/db"
import sendNotification from "@/libs/onesignalServer";

export default async function handler(req, res) {

    const { id } = req.query;

    /* if (req.method === 'GET') {
        try {
            const [rows] = await pool.query('SELECT id, cliente, marca, nota, firma, createdAt FROM notas');
            res.status(200).json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        } */

            if (req.method === 'GET') {
                if (id && req.query.firma) {
                    // Consulta específica para obtener solo la columna `firma`
                    try {
                        const [rows] = await pool.query('SELECT firma FROM notas WHERE id = ?', [id]);
                        if (rows.length > 0) {
                            res.status(200).json({ firma: rows[0].firma });
                        } else {
                            res.status(404).json({ message: 'Nota no encontrada' });
                        }
                    } catch (error) {
                        res.status(500).json({ error: error.message });
                    }
                } else {
                    // Consulta general que devuelve todas las columnas
                    try {
                        const [rows] = await pool.query('SELECT id, cliente, marca, nota, firma, iva, createdAt FROM notas');
                        res.status(200).json(rows);
                    } catch (error) {
                        res.status(500).json({ error: error.message });
                    }
                }


    } else if (req.method === 'POST') {
        const { cliente, marca } = req.body;
        try {
            const [result] = await pool.query(
                'INSERT INTO notas (cliente, marca) VALUES (?, ?)',
                [cliente, marca]
            )

            // Envía notificaciones
            const userIds = [/* Array de IDs de usuario de OneSignal */];
            await sendNotification('Nueva Nota Creada', `Se ha creado una nueva nota para ${cliente}.`, userIds);

            res.status(201).json({ id: result.insertId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'PUT') {
        const { nota, firma, iva } = req.body

        try {
            let query = 'UPDATE notas SET';
            const params = [];
            
            if (nota !== undefined) {
                query += ' nota = ?,';
                params.push(nota);
            }

            if (firma !== undefined) {
                query += ' firma = ?,';
                params.push(firma);
            }

            if (iva !== undefined) {
                query += ' iva = ?,';
                params.push(iva);
            }

            // Remove the trailing comma and add the WHERE clause
            query = query.slice(0, -1) + ' WHERE id = ?';
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
