'use strict';

const getDB = require('../../db/db');

const lugares = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { buscar, datosPermitidos, ordenDatos } = req.query;
    console.log(buscar, datosPermitidos, ordenDatos);

    const validarDatosPermitidos = ['city', 'distric', 'title', 'created_at'];
    const recogerDatosPermitidos = validarDatosPermitidos.includes(
      datosPermitidos
    )
      ? datosPermitidos
      : 'distric';

    const validarOrden = ['ASC', 'DESC'];
    const datosOrdenados = validarOrden.includes(ordenDatos)
      ? ordenDatos
      : 'ASC';

    let lugares;

    if (buscar) {
      [lugares] = await connection.query(
        `
        SELECT id, created_at, title, city, distric
        FROM places
        WHERE distric LIKE ? OR description LIKE ?
        ORDER BY ${recogerDatosPermitidos} ${datosOrdenados}
      `,
        [`%${buscar}%`, `%${buscar}%`]
      );
    } else {
      [lugares] = await connection.query(
        `
        SELECT id, created_at, title, city, distric
        FROM places
        ORDER BY ${recogerDatosPermitidos} ${datosOrdenados}
        `
      );
    }

    let imagenesDeLugares = [];

    if (lugares.length > 0) {
      const arrayIds = lugares.map((place) => {
        return place.id;
      });

      const [imagenes] = await connection.query(`
        SELECT *
        FROM places_photos
        WHERE place_id IN (${arrayIds.join(',')})
      `);

      imagenesDeLugares = lugares.map((place) => {
        const fotosLugar = imagenes.filter((photo) => {
          return photo.place_id === place.id;
        });
        return {
          ...place,
          imagenes: fotosLugar,
        };
      });
    }
    res.send({
      status: 'ok',
      message: 'Listado de lugares',
      data: imagenesDeLugares,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = lugares;
