'use strict';

const getDB = require('../../db/db');
const { generateError } = require('../../helpers');

const validateUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { registrationCode } = req.params;

    const [user] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE registrationCode = ?
    `,
      [registrationCode]
    );

    if (user.length === 0) {
      generateError('Ningún usuario con este código de validación', 404);
    }

    await connection.query(
      `
        UPDATE users
        SET active = true, registrationCode = NULL
        WHERE registrationCode = ?
    `,
      [registrationCode]
    );

    res.send({
      status: 'ok',
      message: 'Usuario validado',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validateUser;
