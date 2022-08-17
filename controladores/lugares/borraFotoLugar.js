'use strict';

const getDB = require('../../db/db');

const { borrarFoto, generarError } = require('../../helpers');

const borraFotoLugar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id, photoID } = req.params;

    const [current] = await connection.query(
      `
            SELECT photo
            FROM places_photos
            WHERE id = ? AND place_id = ?
        `,
      [photoID, id]
    );

    if (current.length === 0) {
      generarError('La foto no existe', 404);
    }

    await borrarFoto(current[0].photo);

    await connection.query(
      `
            DELETE 
            FROM places_photos
            WHERE id = ? AND place_id = ?
        `,
      [photoID, id]
    );

    res.send({
      status: 'ok',
      message: 'Foto borrada',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borraFotoLugar;
