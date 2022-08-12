'use strict';

const getDB = require('../../db/db');

const { savePhoto, generateError } = require('../../helpers');

const addPlacePhoto = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const [currentPhotos] = await connection.query(
      `
            SELECT id
            FROM places_photos
            WHERE place_id = ?
        `,
      [id]
    );

    if (currentPhotos.length >= 3) {
      generateError(
        'No puedes subir más fotos a este lugar, a no ser que borres alguna',
        403
      );
    }

    let savedPhoto;

    if (req.files && Object.keys(req.files).length > 0) {
      console.log(Object.values(req.files)[0]);
      savedPhoto = await savePhoto(Object.values(req.files)[0]);

      await connection.query(
        `
            INSERT INTO places_photos (uploadDate, photo, place_id)
            VALUES (CURRENT_TIMESTAMP,?,?)
           `,
        [savedPhoto, id]
      );
    }

    res.send({
      status: 'ok',
      data: {
        photo: savedPhoto,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = addPlacePhoto;
