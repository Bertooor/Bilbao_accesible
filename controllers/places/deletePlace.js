'use strict';

const getDB = require('../../db/db');

const { deletePhoto } = require('../../helpers');

const deletePlace = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const [photos] = await connection.query(
      `
        SELECT photo 
        FROM places_photos
        WHERE place_id = ?
    `,
      [id]
    );

    await connection.query(
      `
        DELETE
        FROM places_photos
        WHERE place_id = ?
    `,
      [id]
    );

    for (const item of photos) {
      await deletePhoto(item.photo);
    }

    await connection.query(
      `
        DELETE 
        FROM places_complaints
        WHERE place_id = ?
    `,
      [id]
    );

    await connection.query(
      `
        DELETE FROM places WHERE id = ?
    `,
      [id]
    );

    res.send({
      status: 'ok',
      message: `El lugar con id ${id} y todos sus elementos relacionados, fueron borrados de la base de datos.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};
module.exports = deletePlace;
