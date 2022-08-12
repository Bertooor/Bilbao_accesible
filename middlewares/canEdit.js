'use strict';

const getDB = require('../db/db');
const { generateError } = require('../helpers');

const canEdit = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    const [current] = await connection.query(
      `
      SELECT user_id
      FROM places
      WHERE id = ?
    `,
      [id]
    );

    console.log('Id de usuario que creó el place:', current[0].user_id);

    if (
      req.userAuth.id !== current[0].user_id &&
      req.userAuth.role !== 'admin'
    ) {
      generateError('No tienes los permisos para editar el lugar', 401);
    }

    next();
  } catch (error) {
    next(error);
  }
};
module.exports = canEdit;
