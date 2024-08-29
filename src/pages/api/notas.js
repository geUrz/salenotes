// pages/api/notas.js
import pool from "@/libs/db"

import axios from "axios";

const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
const ONE_SIGNAL_API_KEY = process.env.NEXT_PUBLIC_ONESIGNAL_API_KEY;

// Función para enviar notificación
async function sendNotification(message, userIds) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${ONE_SIGNAL_API_KEY}`,
  };

  const data = {
    app_id: ONE_SIGNAL_APP_ID,
    include_external_user_ids: userIds, 
    contents: { en: message },
  };

  try {
    await axios.post('https://onesignal.com/api/v1/notifications', data, { headers });
  } catch (error) {
    console.error('Error sending notification:', error.message);
  }
}

export default async function handler(req, res) {
  const { id, usuario_id, filter } = req.query;

  if (req.method === 'GET') {
    if (id && req.query.firma) {
      try {
        const [rows] = await pool.query('SELECT firma FROM notas WHERE id = ?', [id])
        if (rows.length > 0) {
          res.status(200).json({ firma: rows[0].firma })
        } else {
          res.status(404).json({ message: 'Nota no encontrada' })
        }
      } catch (error) {
        res.status(500).json({ error: error.message })
      }
    } 
    if(usuario_id){
      let query = 'SELECT id, folio, usuario_id, cliente, marca, nota, firma, iva, createdAt FROM notas WHERE usuario_id = ?';
      const params = [usuario_id];

      if (filter === 'dia') {
        query += ' AND DATE(createdAt) = CURDATE()';
      } else if (filter === 'semana') {
        query += ' AND YEARWEEK(createdAt, 1) = YEARWEEK(CURDATE(), 1)';
      } else if (filter === 'mes') {
        query += ' AND YEAR(createdAt) = YEAR(CURDATE()) AND MONTH(createdAt) = MONTH(CURDATE())';
      }

      try {
        const [rows] = await pool.query(query, params);
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      try {
        const [rows] = await pool.query('SELECT id, folio, cliente, marca, nota, firma, iva, createdAt FROM notas');
        res.status(200).json(rows);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
    
  } else if (req.method === 'POST') {

    const { folio, cliente, marca, usuario_id } = req.body;

    // Verificar que usuario_id no sea null, undefined o inválido
    if (!usuario_id) {
      return res.status(400).json({ error: 'usuario_id es requerido y debe ser válido' });
    }

    // Verificar que usuario_id exista en la tabla usuario
    try {
      const [userRows] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [usuario_id]);
      if (userRows.length === 0) {
        return res.status(400).json({ error: 'usuario_id no existe en la tabla usuario' });
      }

      const [result] = await pool.query(
        'INSERT INTO notas (folio, cliente, marca, usuario_id) VALUES (?, ?, ?, ?)',
        [folio, cliente, marca, usuario_id]
      )

      // Obtener IDs de usuarios administradores
      const [adminRows] = await pool.query('SELECT id FROM usuarios WHERE is_admin = ?', ['true']);
      const adminIds = adminRows.map(row => row.id);

      // Enviar notificación
      const message = `Se ha creado una nueva nota para el cliente ${cliente}.`;
      if (adminIds.length > 0) {
        await sendNotification(message, adminIds);
      }

      res.status(201).json({ id: result.insertId })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'PUT') {
    const { nota, firma, iva } = req.body

    try {
      let query = 'UPDATE notas SET'
      const params = []

      if (nota !== undefined) {
        query += ' nota = ?,'
        params.push(nota);
      }

      if (firma !== undefined) {
        query += ' firma = ?,'
        params.push(firma);
      }

      if (iva !== undefined) {
        query += ' iva = ?,'
        params.push(iva);
      }

      query = query.slice(0, -1) + ' WHERE id = ?'
      params.push(id);

      const [result] = await pool.query(query, params)

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Nota actualizada correctamente' })
      } else {
        res.status(404).json({ message: 'Nota no encontrada' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query
    try {
      const [result] = await pool.query(
        'DELETE FROM notas WHERE id = ?',
        [id]
      );

      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Nota eliminada correctamente' })
      } else {
        res.status(404).json({ message: 'Nota no encontrada' })
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
