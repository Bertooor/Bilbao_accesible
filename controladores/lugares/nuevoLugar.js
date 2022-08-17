'use strict';

const getDB = require('../../db/db');
const { guardarFoto, generarError } = require('../../helpers');

const nuevoLugar = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();
    //joi
    const { title, city, distric, description } = req.body;

    if (!title || !description || !city || !distric) {
      generarError('Te falta algún campo obligatorio por rellenar', 400);
    }

    const [result] = await connection.query(
      `
        INSERT INTO places ( title, city, distric, description, user_id)
        VALUES (?,?,?,?,?);
    `,
      [title, city, distric, description, req.userAuth.id]
    );

    const { insertId } = result;

    if (req.files && Object.keys(req.files).length > 0) {
      for (const photosData of Object.values(req.files).slice(0, 3)) {
        const photoName = await guardarFoto(photosData);
        await connection.query(
          `
                INSERT INTO places_photos(uploadDate, photo, place_id)
                VALUES(CURRENT_TIMESTAMP,?,?);
            `,
          [photoName, insertId]
        );
      }
    }

    res.send({
      status: 'ok',
      message: 'Nuevo lugar',
      data: {
        id: insertId,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = nuevoLugar;
