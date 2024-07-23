import pool from "@/libs/db";

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const connection = await pool.getConnection()
        try {
            const [rows] = await connection.query('SELECT SUM(precio) AS total FROM conceptos');
            const total = rows[0].total || 0; registros
            return res.status(200).json({ total });
        } catch (error) {
            console.error('Error al obtener el total de precios:', error)
            return res.status(500).json({ error: 'Ocurrió un error al obtener el total de precios.' })
        } finally {
            connection.release()
        }
    } else {
        return res.status(405).json({ error: 'Método no permitido' })
    }
}