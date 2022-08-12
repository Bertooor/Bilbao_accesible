'use strict';

const getDB = require('../../db/db');

const getUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const [user] = await connection.query(
      `
      SELECT id, created_at, email, name, avatar, role
      FROM users
      WHERE id = ?
    `,
      [id]
    );

    console.log('user', user);

    const userInfo = {
      name: user[0].name,
      avatar: user[0].avatar,
    };

    console.log('req.userAuth', req.userAuth);

    if (req.userAuth.id === user[0].id || req.userAuth.role === 'admin') {
      userInfo.id = user[0].id;
      userInfo.email = user[0].email;
      userInfo.role = user[0].role;
      userInfo.date = user[0].created_at;
    }

    res.send({
      status: 'ok',
      message: 'Get user',
      data: {
        userInfo,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = getUser;
