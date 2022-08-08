'use strict';

const getDB = require('../../db/db');

const complaintPlace = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;
    const { complaint } = req.body;

    console.log('id', id);
    console.log('complaint', complaint);
    //joi
    if (complaint !== 1) {
      const error = new Error('La denuncia se hace con el "1"');
      error.httpStatus = 400;
      throw error;
    }

    const [existingComplaint] = await connection.query(
      `
            SELECT id
            FROM places_complaints
            WHERE user_id = ? AND place_id = ?
        `,
      [req.headers.authorization, id]
    );

    if (existingComplaint.length > 0) {
      const error = new Error('Ya denunciaste este problema');
      error.httpStatus = 403;
      throw error;
    }

    await connection.query(
      `
            INSERT INTO places_complaints (created_at, complaint, place_id, user_id)
            VALUES (CURRENT_TIMESTAMP,?,?,?)
        `,
      [complaint, id, req.headers.authorization]
    );

    const [numberComplaints] = await connection.query(
      `
            SELECT *
            FROM places_complaints
            WHERE place_id = ? 
        `,
      [id]
    );

    res.send({
      status: 'ok',
      data: {
        ...numberComplaints[0],
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = complaintPlace;
