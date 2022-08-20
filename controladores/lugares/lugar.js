'use strict';

const getDB = require('../../db/db');

const lugar = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [datosLugar] = await connection.query(
      `
      SELECT id, created_at, title, description, city, distric, problem_solved
      FROM places
      WHERE id = ?
    `,
      [id]
    );

    const [imagenes] = await connection.query(
      `
      SELECT id, uploadDate, photo, place_id
      FROM places_photos
      WHERE place_id = ?
    `,
      [id]
    );

    const [numDenunciasLugar] = await connection.query(
      `
            SELECT count(complaint) AS denuncias_lugar
            FROM places_complaints
            WHERE place_id = ?
      `,
      [id]
    );

    const [totalDenuncias] = await connection.query(`
      SELECT count(id) AS denuncias_totales
      FROM places_complaints
    `);

    res.send({
      status: 'ok.',
      message: 'Detalles del lugar.',
      data: {
        ...datosLugar[0],
        imagenes,
        ...numDenunciasLugar[0],
        ...totalDenuncias[0],
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = lugar;
