'use strict';

const getDB = require('../db/db');
const { generateError } = require('../helpers');

const placeExist = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [result] = await connection.query(
      `
      SELECT id 
      FROM places 
      WHERE id = ?
    `,
      [id]
    );

    console.log(result, id);

    if (result.length === 0) {
      generateError('Lugar no encontrado', 404);
    }
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = placeExist;
