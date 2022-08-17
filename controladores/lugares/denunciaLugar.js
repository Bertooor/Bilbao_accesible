'use strict';

const getDB = require('../../db/db');
const { generarError } = require('../../helpers');

const denunciaLugar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;
    const { complaint } = req.body;

    if (complaint !== 1) {
      generarError('La denuncia se hace con el "1"', 400);
    }

    const [existingComplaint] = await connection.query(
      `
            SELECT id
            FROM places_complaints
            WHERE user_id = ? AND place_id = ?
        `,
      [req.userAuth.id, id]
    );

    if (existingComplaint.length > 0) {
      generarError('Ya denunciaste este problema', 400);
    }

    await connection.query(
      `
            INSERT INTO places_complaints (created_at, complaint, place_id, user_id)
            VALUES (CURRENT_TIMESTAMP,?,?,?)
        `,
      [complaint, id, req.userAuth.id]
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

module.exports = denunciaLugar;
