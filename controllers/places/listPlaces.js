'use strict';

const getDB = require('../../db/db');

const listPlaces = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { search, order, direction } = req.query;

    const validatorOrderField = ['city', 'distric', 'title'];
    const orderBy = validatorOrderField.includes(order) ? order : 'distric';

    const validatorDirectionField = ['ASC', 'DESC'];
    const orderDirection = validatorDirectionField.includes(direction)
      ? direction
      : 'ASC';

    let places;

    if (search) {
      [places] = await connection.query(
        `
        SELECT id, created_at, title, city, distric
        FROM places
        WHERE description LIKE ?
        ORDER BY ${orderBy} ${orderDirection}
      `,
        [`%${search}%`]
      );
    } else {
      [places] = await connection.query(
        `
        SELECT id, created_at, title, city, distric
        FROM places
        ORDER BY ${orderBy} ${orderDirection}
        `
      );
    }

    let placesWithPhotos;

    if (places.length > 0) {
      const arrayIds = places.map((place) => {
        return place.id;
      });

      const [photos] = await connection.query(`
        SELECT *
        FROM places_photos
        WHERE place_id IN (${arrayIds.join(',')})
      `);

      placesWithPhotos = places.map((place) => {
        const photosPlace = photos.filter((photo) => {
          return photo.place_id === place.id;
        });
        return {
          ...place,
          photos: photosPlace,
        };
      });
    }
    res.send({
      status: 'ok',
      message: 'Listado de lugares',
      data: placesWithPhotos,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listPlaces;
