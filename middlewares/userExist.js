'use strict';

const getDB = require('../db/db');
const { generateError } = require('../helpers');

const userExist = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const [result] = await connection.query(
      `
        SELECT id
        FROM users
        WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      generateError('Usuario no encontrado', 404);
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = userExist;
