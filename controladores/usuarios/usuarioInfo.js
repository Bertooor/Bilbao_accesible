'use strict';

const getDB = require('../../db/db');

const usuarioInfo = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const [usuario] = await connection.query(
      `
      SELECT id, created_at, email, name, avatar
      FROM users
      WHERE id = ?
    `,
      [id]
    );

    const usuarioInf = {
      name: usuario[0].name,
      avatar: usuario[0].avatar,
    };

    if (req.userAuth.id === usuario[0].id || req.userAuth.role === 'admin') {
      usuarioInf.id = usuario[0].id;
      usuarioInf.email = usuario[0].email;
      usuarioInf.date = usuario[0].created_at;
    }

    res.send({
      status: 'ok.',
      message: 'Información usuario.',
      data: {
        usuarioInf,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = usuarioInfo;
