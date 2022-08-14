'use strict';

const getDB = require('../../db/db');
const { generateError } = require('../../helpers');

const resetUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { recoverCode, newPassword } = req.body;

    if (!recoverCode || !newPassword || newPassword.length < 6) {
      generateError('Faltan campos por completar', 400);
    }

    const [user] = await connection.query(
      `
            SELECT id
            FROM users
            WHERE recoverCode = ?
        `,
      [recoverCode]
    );

    if (user.length === 0) {
      generateError('Código de recuperación incorrecto.', 404);
    }

    await connection.query(
      `
            UPDATE users
            SET password = SHA2(?, 512), lastAuthUpdate = ?, recoverCode = NULL
            WHERE id = ?
        `,
      [newPassword, new Date(), user[0].id]
    );

    res.send({
      status: 'ok',
      message: 'Contraseña cambiada con éxito.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = resetUserPassword;
