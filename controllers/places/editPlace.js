'use strict';

const getDB = require('../../db/db');

const editPlace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    res.send({
      status: 'ok',
      message: 'Lugar editado',
      data: [],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editPlace;
