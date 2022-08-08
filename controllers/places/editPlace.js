'use strict';

const getDB = require('../../db/db');

const editPlace = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { id } = req.params;

    //joi
    const { title, city, distric, description } = req.body;

    if (!title || !description || !city || !distric) {
      const error = new Error('Te falta algún campo obligatorio por rellenar');
      error.httpStatus = 400;
      throw error;
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
