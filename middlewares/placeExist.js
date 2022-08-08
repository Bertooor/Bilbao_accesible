'use strict';

const getDB = require('../db/db');

const placeExist = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT id FROM places WHERE id = ?
    `,
      [id]
    );

    if (result.length === 0) {
      const error = new Error('Lugar no encontrado');
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = placeExist;
