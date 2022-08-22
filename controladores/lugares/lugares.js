'use strict';

const getDB = require('../../db/db');

const lugares = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { buscar, datosPermitidos, ordenDatos } = req.query;

    //A través de query.params se podrá acceder a los lugares por medio de "'city', 'distric', 'title', 'created_at'"

    const validarDatosPermitidos = ['city', 'distric', 'title', 'created_at'];
    const recogerDatosPermitidos = validarDatosPermitidos.includes(
      datosPermitidos
    )
      ? datosPermitidos
      : 'distric';

    //Además serán devueltos dependiendo del dato seleccionado en orden ascendente o descendente.

    const validarOrden = ['ASC', 'DESC'];
    const datosOrdenados = validarOrden.includes(ordenDatos)
      ? ordenDatos
      : 'ASC';

    let lugares;

    //También se podrán hacer búsquedas de palabras contenidas en barrio o descripción.

    if (buscar) {
      [lugares] = await connection.query(
        `
        SELECT id, created_at AS fecha, title AS título, city AS ciudad, distric AS barrio
        FROM places
        WHERE distric LIKE ? OR description LIKE ?
        ORDER BY ${recogerDatosPermitidos} ${datosOrdenados}
      `,
        [`%${buscar}%`, `%${buscar}%`]
      );
    } else {
      [lugares] = await connection.query(
        `
        SELECT id, created_at AS fecha, title AS título, city AS ciudad, distric AS barrio
        FROM places
        ORDER BY ${recogerDatosPermitidos} ${datosOrdenados}
        `
      );
    }

    res.send({
      status: 'ok.',
      message: 'Listado de lugares.',
      data: lugares,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = lugares;
