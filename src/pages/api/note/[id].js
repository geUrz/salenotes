
import pool from "@/libs/db";

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            // Obtener la nota
            const [notaRows] = await pool.query('SELECT * FROM notas WHERE id = ?', [id]);

            if (notaRows.length === 0) {
                return res.status(404).json({ error: 'Nota no encontrada' });
            }

            const nota = notaRows[0];

            // Obtener los conceptos asociados a la nota
            const [conceptosRows] = await pool.query('SELECT * FROM conceptos WHERE nota_id = ?', [id]);

            // Enviar la respuesta con la nota y sus conceptos
            res.status(200).json({ nota, conceptos: conceptosRows });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}