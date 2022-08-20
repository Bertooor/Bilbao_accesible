'use strict';

const getDB = require('../../db/db');
const { validar, generarError } = require('../../helpers');
const { adminSchema } = require('../../schemas');

const loginAdmin = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    await validar(adminSchema, req.body);

    const { name, email, password } = req.body;

    const [admin] = await connection.query(
      `
            SELECT id, role
            FROM users
            WHERE name = ? AND email = ? AND password = SHA2(?, 512)
        `,
      [name, email, password]
    );

    if (admin.length === 0) {
      generarError('Datos incorrectos.', 401);
    }

    res.send({
      status: 'ok.',
      message: 'Datos correctos, acceso a zona de administración.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginAdmin;
