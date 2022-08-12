'use strict';

const getDB = require('../../db/db');
const { generateError } = require('../../helpers');

const editPlace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    //joi
    const { title, city, distric, description } = req.body;

    if (!title || !description || !city || !distric) {
      generateError('Te falta algún campo obligatorio por rellenar', 400);
    }

    await connection.query(
      `
        UPDATE places SET title=?, city=?, distric=?, description=? 
        WHERE id=?
    `,
      [title, city, distric, description, id]
    );

    res.send({
      status: 'ok',
      message: 'Lugar editado',
      data: {
        id,
        title,
        description,
        city,
        distric,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editPlace;
