'use strict';

const getDB = require('../db/db');

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
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = canEdit;
