'use strict';

const getDB = require('../../db/db');
const { generateError } = require('../../helpers');

const deleteUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    if (Number(id) === 1) {
      generateError('El administrador principal no se puede eliminar', 403);
    }

    if (req.userAuth.id !== Number(id) && req.userAuth.role !== 'admin') {
      generateError('No tienes permisos para eliminar a este usuario', 401);
    }

    await connection.query(
      `
        DELETE
        FROM users
        WHERE id = ?
        `,
      [id]
    );

    res.send({
      status: 'ok',
      message: `El usuario con id: ${id}, ha sido borrado de la base de datos`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = deleteUser;
