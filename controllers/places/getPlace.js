'use strict';

const getDB = require('../../db/db');

const getPlace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    console.log('id', id);

    const [result] = await connection.query(
      `
      SELECT id, created_at, title, description, city, distric
      FROM places
      WHERE id = ?
    `,
      [id]
    );

    const [photos] = await connection.query(
      `
      SELECT id, created_at, photo, place_id
      FROM places_photos
      WHERE place_id = ?
    `,
      [id]
    );

    const [complaints] = await connection.query(
      `
      SELECT complaint
      FROM places_complaints
      WHERE id = ?
    `,
      [id]
    );

    res.send({
      status: 'ok',
      message: 'Detalle del lugar',
      data: {
        ...result[0],
        photos,
        complaints,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getPlace;
