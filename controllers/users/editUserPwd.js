'use strict';

const getDB = require('../../db/db');
const { generateError } = require('../../helpers');

const editUserPwd = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { oldPwd, newPwd } = req.body;

    const [user] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE id = ? AND password = SHA2(?, 512)
    `,
      [req.userAuth.id, oldPwd]
    );

    if (user.length === 0) {
      generateError('Antigua contraseña, no correcta', 401);
    }

    await connection.query(
      `
        UPDATE users
        SET password = SHA2(?, 512), lastAuthUpdate = ?
        WHERE id = ?
    `,
      [newPwd, new Date(), req.userAuth.id]
    );

    res.send({
      status: 'ok',
      message: 'Contraseña cambiada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUserPwd;
