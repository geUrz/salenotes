import pool from '@/libs/db'; // Asegúrate de importar la configuración de la base de datos
import bcrypt from 'bcrypt';

export default async function updateUserHandler(req, res) {
  const { userId, newUsuario, newEmail, newIsAdmin, newPassword } = req.body;

  try {
    // Verificar si el nuevo email o el nuevo nombre de usuario ya están registrados por otro usuario
    const [existingUser] = await pool.query(
      'SELECT * FROM usuarios WHERE (email = ? OR usuario = ?) AND id != ?',
      [newEmail, newUsuario, userId] // Se eliminó newIsAdmin de la consulta
    );

    if (existingUser.length > 0) {
      if (newEmail && existingUser.some(user => user.email === newEmail)) {
        return res.status(400).json({ error: 'El correo ya está registrado' });
      }
      if (newUsuario && existingUser.some(user => user.usuario === newUsuario)) {
        return res.status(400).json({ error: 'El nombre de usuario ya está registrado' });
      }
    }

    // Si se proporciona una nueva contraseña, hashearla
    let hashedPassword;
    if (newPassword) {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Obtener los datos actuales del usuario para no sobreescribirlos si no se pasan nuevos valores
    const [currentUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [userId]);

    if (currentUser.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const updatedUsuario = newUsuario || currentUser[0].usuario;
    const updatedEmail = newEmail || currentUser[0].email;
    const updatedIsAdmin = newIsAdmin !== undefined ? newIsAdmin : currentUser[0].is_admin;
    const updatedPassword = hashedPassword || currentUser[0].password;

    // Actualizar el usuario en la base de datos
    const [result] = await pool.query(
      'UPDATE usuarios SET usuario = ?, email = ?, is_admin = ?, password = ? WHERE id = ?',
      [updatedUsuario, updatedEmail, updatedIsAdmin, updatedPassword, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No se pudo actualizar el usuario. Verifica los datos proporcionados.' });
    }

    // Devolver una respuesta exitosa
    return res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}
