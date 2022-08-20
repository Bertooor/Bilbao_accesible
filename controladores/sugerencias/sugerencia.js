'use strict';

const getDB = require('../../db/db');

const sugerencia = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [datosSugerencia] = await connection.query(
      `
      SELECT id, created_at, title, description, city, distric
      FROM suggestions
      WHERE id = ?
    `,
      [id]
    );

    const [imagenes] = await connection.query(
      `
      SELECT id, uploadDate, photo, suggestion_id
      FROM suggestions_photos
      WHERE suggestion_id = ?
    `,
      [id]
    );

    res.send({
      status: 'ok.',
      message: 'Detalles de la sugerencia.',
      data: {
        ...datosSugerencia[0],
        imagenes,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = sugerencia;
